fetch("http://localhost:8080/api/projects")
  .then(res => res.json())
  .then(data => {
    const ul = document.getElementById("projects");

    data.forEach(p => {
      const li = document.createElement("li");
      li.textContent = `${p.name} - ${p.status}`;
      ul.appendChild(li);
    });
  })
  .catch(err => console.error(err));
