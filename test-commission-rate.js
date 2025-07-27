const updateCommissionRate = async () => {
  const response = await fetch('http://localhost:3000/api/admin/institutions/0fc20433-04a8-492a-980f-2f36272d3952/commission-rate', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      newRate: 15,
      reason: 'Updated commission rate',
    }),
  });

  const data = await response.json();
  // // console.log(data);
};

updateCommissionRate(); 