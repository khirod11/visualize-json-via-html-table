document.addEventListener('DOMContentLoaded', () => {
  const employeeTable = document.getElementById('employeeTable');
  const employeeData = document.getElementById('employeeData');

  fetch('https://rc-vault-fap-live-1.azurewebsites.net/api/gettimeentries?code=vO17RnE8vuzXzPJo5eaLLjXjmRW07law99QTD90zat9FfOQJKKUcgQ==', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  })
    .then(response => response.json())
    .then(data => {
      const employees = data.sort((a, b) => calculateTotalTimeWorked(a) - calculateTotalTimeWorked(b));

      employees.forEach(employee => {
        const row = document.createElement('tr');
        const nameCell = document.createElement('td');
        const timeCell = document.createElement('td');

        nameCell.textContent = employee.EmployeeName;
        timeCell.textContent = formatTotalTimeWorked(calculateTotalTimeWorked(employee));

        row.appendChild(nameCell);
        row.appendChild(timeCell);

        if (calculateTotalTimeWorked(employee) < 100) {
          row.classList.add('red');
        }

        employeeData.appendChild(row);
      });
    })
    .catch(error => console.log(error));
});

function calculateTotalTimeWorked(employee) {
  const timeEntries = employee.TimeEntries || [];
  let totalMinutes = 0;

  for (const entry of timeEntries) {
    const [hours, minutes] = entry.WorkedTime.split(':');
    totalMinutes += Number(hours) * 60 + Number(minutes);
  }

  return totalMinutes;
}

function formatTotalTimeWorked(totalMinutes) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${hours}hrs ${minutes}min`;
}
