import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { isValid, isBefore } from 'date-fns';

export const dynamic = 'force-dynamic';

const calculateMonthlyPrice = (monthNumber: number, basePrice: number) => {
  // Calculate total price for all months up to current month
  const totalPrice = basePrice * monthNumber;
  
  // Apply progressive discount (5% per month, capped at 50%)
  const discountRate = Math.min(monthNumber * 5, 50);
  const discount = totalPrice * (discountRate / 100);
  
  // Calculate final price
  const finalPrice = totalPrice - discount;
  
  // Round to nearest whole number
  return Math.round(finalPrice);
};

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // console.log('Unauthorized access attempt to calculate-price');
      return NextResponse.json({ 
        error: 'Unauthorized',
        details: 'Please sign in to calculate course price'
      }, { status: 401 });
    }

    const body = await request.json();
    console.log('Calculate price request body:', body);
    
    const { courseId, startDate, endDate } = body;

    if (!courseId || !startDate || !endDate) {
      console.log('Missing required fields:', { courseId, startDate, endDate });
      return NextResponse.json(
        { 
          error: 'Missing required information',
          details: 'Course ID, start date, and end date are required'
        },
        { status: 400 }
      );
    }

    // Get course details
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    console.log('Course lookup result:', { courseId, courseFound: !!course, course });

    if (!course) {
      console.log('Course not found:', courseId);
      return NextResponse.json(
        { 
          error: 'Course not found',
          details: 'The course you are trying to enroll in does not exist'
        },
        { status: 404 }
      );
    }

    // Get pricing data separately
    const [weeklyPrices, monthlyPrices] = await Promise.all([
      prisma.course_weekly_prices.findMany({
        where: { courseId: courseId },
        orderBy: { weekNumber: 'asc' }
      }),
      prisma.course_monthly_price.findMany({
        where: { courseId: courseId },
        orderBy: { monthNumber: 'asc' }
      })
    ]);

    console.log('Pricing data:', { 
      courseId, 
      pricingPeriod: course.pricingPeriod,
      weeklyPricesCount: weeklyPrices.length, 
      monthlyPricesCount: monthlyPrices.length,
      weeklyPrices: weeklyPrices.slice(0, 3), // Log first 3 for debugging
      monthlyPrices: monthlyPrices.slice(0, 3) // Log first 3 for debugging
    });

    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);

    console.log('Date validation:', { 
      startDate, 
      endDate, 
      start: start.toISOString(), 
      end: end.toISOString(),
      startValid: isValid(start),
      endValid: isValid(end),
      isBeforeEnd: isBefore(end, start)
    });

    if (!isValid(start) || !isValid(end)) {
      console.log('Invalid dates detected');
      return NextResponse.json(
        { 
          error: 'Invalid dates',
          details: 'The provided start or end date is invalid'
        },
        { status: 400 }
      );
    }

    if (isBefore(end, start)) {
      console.log('End date before start date detected');
      return NextResponse.json(
        { 
          error: 'Invalid date range',
          details: 'End date must be after start date'
        },
        { status: 400 }
      );
    }

    let totalPrice = 0;

    console.log('Starting price calculation:', { 
      pricingPeriod: course.pricingPeriod, 
      basePrice: course.base_price 
    });

    // Calculate price based on pricing period
    switch (course.pricingPeriod) {
      case 'WEEKLY': {
        // Calculate number of weeks between start and end date
        const weeks = Math.ceil((end.getTime() - start.getTime()) / (7 * 24 * 60 * 60 * 1000));
        
        console.log('Weekly pricing calculation:', { weeks, weeklyPricesCount: weeklyPrices.length });
        
        if (!weeklyPrices || weeklyPrices.length === 0) {
          console.log('No weekly prices configured, falling back to base price calculation');
          
          // Fall back to base price calculation if no weekly prices are configured
          if (!course.base_price || course.base_price <= 0) {
            console.log('No base price configured either');
            return NextResponse.json(
              { 
                error: 'Missing pricing configuration',
                details: 'Weekly prices and base price are not configured for this course. Please contact the institution.'
              },
              { status: 400 }
            );
          }
          
          // Calculate weekly price based on base price
          const weeklyPrice = course.base_price / 4; // Assume 4 weeks per month
          totalPrice = Math.round(weeklyPrice * weeks);
          console.log('Calculated weekly price using base price:', { weeks, basePrice: course.base_price, weeklyPrice, totalPrice });
        } else {
          // Sort weekly prices by week number in descending order
          const sortedWeeklyPrices = [...weeklyPrices].sort((a, b) => b.weekNumber - a.weekNumber);
          const maxWeeks = sortedWeeklyPrices[0].weekNumber;
          
          // If the calculated weeks exceed the maximum available weeks,
          // use the maximum available weekly price
          const effectiveWeeks = Math.min(weeks, maxWeeks);
          const weeklyPrice = sortedWeeklyPrices.find(wp => wp.weekNumber === effectiveWeeks);
          
          if (!weeklyPrice) {
            console.log('No weekly price found for effective weeks');
            return NextResponse.json(
              { 
                error: 'Invalid enrollment period',
                details: `No price found for ${effectiveWeeks} weeks. Available periods: ${sortedWeeklyPrices.map(wp => wp.weekNumber).join(', ')} weeks`
              },
              { status: 400 }
            );
          }
          
          // Calculate the total price based on the effective weeks
          totalPrice = weeklyPrice.price;
          
          // If the actual weeks exceed the maximum, adjust the price proportionally
          if (weeks > maxWeeks) {
            const pricePerWeek = weeklyPrice.price / maxWeeks;
            totalPrice = Math.round(pricePerWeek * weeks);
          }
          
          console.log('Using stored weekly price:', { weeks, effectiveWeeks, totalPrice });
        }
        
        break;
      }
      
      case 'MONTHLY': {
        // Calculate number of months between start and end date
        const months = (end.getFullYear() - start.getFullYear()) * 12 + 
                      (end.getMonth() - start.getMonth()) + 1;
        
        console.log('Monthly pricing calculation:', { months, monthlyPricesCount: monthlyPrices.length });
        
        if (!monthlyPrices || monthlyPrices.length === 0) {
          console.log('No monthly prices configured, falling back to base price calculation');
          
          // Fall back to base price calculation if no monthly prices are configured
          if (!course.base_price || course.base_price <= 0) {
            console.log('No base price configured either');
            return NextResponse.json(
              { 
                error: 'Missing pricing configuration',
                details: 'Monthly prices and base price are not configured for this course. Please contact the institution.'
              },
              { status: 400 }
            );
          }
          
          // Use the calculateMonthlyPrice function with base price
          totalPrice = calculateMonthlyPrice(months, course.base_price);
          console.log('Calculated price using base price:', { months, basePrice: course.base_price, totalPrice });
        } else {
          // Get the monthly price for the calculated number of months
          const monthlyPrice = monthlyPrices.find(mp => mp.monthNumber === months);
          
          if (monthlyPrice) {
            // Use the stored monthly price if available
            totalPrice = monthlyPrice.price;
            console.log('Using stored monthly price:', { months, totalPrice });
          } else {
            // Calculate the price based on base price if no stored price exists
            if (!course.base_price || course.base_price <= 0) {
              console.log('No base price configured for fallback calculation');
              return NextResponse.json(
                { 
                  error: 'Missing pricing configuration',
                  details: `No price found for ${months} months and no base price configured. Available periods: ${monthlyPrices.map(mp => mp.monthNumber).join(', ')} months`
                },
                { status: 400 }
              );
            }
            
            totalPrice = calculateMonthlyPrice(months, course.base_price);
            console.log('Calculated price using base price fallback:', { months, basePrice: course.base_price, totalPrice });
          }
        }
        break;
      }
      
      case 'FULL_COURSE':
      default:
        if (!course.base_price || course.base_price <= 0) {
          return NextResponse.json(
            { 
              error: 'Missing pricing configuration',
              details: 'Base price is not configured for this course'
            },
            { status: 400 }
          );
        }
        totalPrice = course.base_price;
        break;
    }

    // Validate final price
    if (!totalPrice || totalPrice <= 0) {
      console.log('Invalid final price calculated:', totalPrice);
      return NextResponse.json(
        { 
          error: 'Invalid price calculated',
          details: 'The calculated price is invalid. Please contact support.'
        },
        { status: 500 }
      );
    }

    console.log('Price calculation successful:', { 
      courseId, 
      pricingPeriod: course.pricingPeriod, 
      totalPrice, 
      startDate: start.toISOString(), 
      endDate: end.toISOString() 
    });

    return NextResponse.json({
      status: 'success',
      price: totalPrice,
      startDate: start.toISOString(),
      endDate: end.toISOString(),
      weeks: course.pricingPeriod === 'WEEKLY' ? 
        Math.ceil((end.getTime() - start.getTime()) / (7 * 24 * 60 * 60 * 1000)) : undefined,
      months: course.pricingPeriod === 'MONTHLY' ? 
        (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth()) + 1 : undefined
    });
  } catch (error) {
    console.error('Error calculating course price:', error);
    return NextResponse.json(
      { 
        error: 'Failed to calculate course price',
        details: 'An unexpected error occurred. Please try again later.',
        technicalDetails: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 