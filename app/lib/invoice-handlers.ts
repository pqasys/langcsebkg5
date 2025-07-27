// import { toast } from 'sonner';

export async function handleSendInvoice(enrollmentId: string) {
  try {
    const response = await fetch(`/api/institution/enrollments/${enrollmentId}/invoice`, {
      method: 'POST',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to send invoice');
    }

    // // // // // // console.log('Invoice sent successfully');
  } catch (error) {
    console.error('Error sending invoice:', error);
    console.error(error instanceof Error ? error.message : 'Failed to send invoice');
  }
}

export async function handleDownloadInvoice(enrollmentId: string) {
  try {
    const response = await fetch(`/api/institution/enrollments/${enrollmentId}/invoice`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to download invoice');
    }

    // Get the filename from the Content-Disposition header
    const contentDisposition = response.headers.get('Content-Disposition');
    const filename = contentDisposition
      ? contentDisposition.split('filename=')[1].replace(/"/g, '')
      : `invoice-${enrollmentId}.pdf`;

    // Convert the response to a blob
    const blob = await response.blob();
    
    // Create a download link
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    
    // Trigger the download
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    console.log('Invoice downloaded successfully');
  } catch (error) {
    console.error('Error downloading invoice:', error);
    console.error(error instanceof Error ? error.message : 'Failed to download invoice');
  }
} 