export async function createAppointment(data) {
    console.log(JSON.stringify(data))
  const response = await fetch('http://localhost:3001/api/appointments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorResponse = await response.json();
    const message = errorResponse.error || errorResponse.message || JSON.stringify(errorResponse);
    throw new Error(message);
  }

  return await response.json();
}