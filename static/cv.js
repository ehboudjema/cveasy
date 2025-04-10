function jsonToYaml() {
	const input = document.getElementById("inputArea").value;
	try {
	  const json = JSON.parse(input);
	  const yaml = jsyaml.dump(json);
	  document.getElementById("outputArea").value = yaml;
	} catch (error) {
	  document.getElementById("outputArea").value = "Error: Invalid YML";
	  console.error(error);
	}
  }

  function yamlToJson(input) {
	
	try {
	  const json = jsyaml.load(input);
	  const jsonString = JSON.stringify(json, null, 2);
	  //document.getElementById("outputArea").value = jsonString;
	  return json
	} catch (error) {
	  //document.getElementById("outputArea").value = "Error: Invalid YAML";
	  return ("Error: Invalid YAML"+error);
	  console.error(error);
	}
  }



  let cvData = yamlToJson(localStorage.getItem('cvData')) || yamlToJson(defaultCvData);
  document.getElementById('json-input').value = localStorage.getItem('cvData') || defaultCvData;

  function loadCV(data) {
	  document.getElementById("profile-info").innerHTML = `
		  <h1>${data.profileInfo.name}</h1>
		  <div class="tagline">${data.profileInfo.tagline}</div>
	  `;

	  document.getElementById("contact").innerHTML = generateSection(data.contact);
	  document.getElementById("computer-skills").innerHTML = generateSection(data.computerSkills, true);
	  document.getElementById("languages").innerHTML = generateSection(data.languages, true);
	  document.getElementById("skills").innerHTML = generateBubbleSkills(data.skills);
	  document.getElementById("personal-skills").innerHTML = generatePersonalSkills(data.personalSkills);
	  document.getElementById("hobbies").innerHTML = generateHobbies(data.hobbies);
	  document.getElementById("experience").innerHTML = generateExperience(data.experience);
	  document.getElementById("education").innerHTML = generateEducation(data.education);
	  document.getElementById("additional-education").innerHTML = generateEducation(data.additionalEducation);
  }

  function generateSection(sectionData, isSkill = false) {
	  let html = `
		  <div class="section-title">
			  <i class="${sectionData.items[0].icon || 'fas fa-list'}"></i>
			  <span>${sectionData.title}</span>
		  </div>
	  `;
	  if (isSkill) {
		  sectionData.items.forEach(item => {
			  html += `
				  <div class="skills-item">
					  <div class="skill-name">
						  <span>${item.name}</span>
						  <span>${item.percentage}%</span>
					  </div>
					  <div class="skill-bar">
						  <div class="skill-progress" style="width: ${item.percentage}%"></div>
					  </div>
				  </div>
			  `;
		  });
	  } else {
		  sectionData.items.forEach(item => {
			  html += `
				  <div class="contact-item">
					  <i class="${item.icon}"></i>
					  <span>${item.text}</span>
				  </div>
			  `;
		  });
	  }
	  return html;
  }

  function generateBubbleSkills(skillsData) {
	  let html = `
		  <div class="section-title">
			  <i class="fas fa-certificate"></i>
			  <span>${skillsData.title}</span>
		  </div>
		  <div class="bubble-skills">
	  `;
	  skillsData.items.forEach(skill => {
		  html += `<span class="bubble">${skill}</span>`;
	  });
	  html += `</div>`;
	  return html;
  }

  function generatePersonalSkills(skillsData) {
	  let html = `
		  <div class="section-title">
			  <i class="fas fa-user-check"></i>
			  <span>${skillsData.title}</span>
		  </div>
		  <div class="soft-skills">
	  `;
	  skillsData.items.forEach(skill => {
		  html += `
			  <div class="soft-skill-item">
				  <i class="fas fa-check-circle"></i>
				  <span>${skill}</span>
			  </div>
		  `;
	  });
	  html += `</div>`;
	  return html;
  }

  function generateHobbies(hobbiesData) {
	  let html = `
		  <div class="section-title">
			  <i class="fas fa-heart"></i>
			  <span>${hobbiesData.title}</span>
		  </div>
		  <div class="hobbies">
	  `;
	  hobbiesData.items.forEach(hobby => {
		  html += `
			  <div class="hobby-item">
				  <i class="${hobby.icon}"></i>
				  <span>${hobby.text}</span>
			  </div>
		  `;
	  });
	  html += `</div>`;
	  return html;
  }

  function generateExperience(experienceData) {
	  let html = `
		  <div class="section-title">
			  <i class="fas fa-briefcase"></i>
			  <span>${experienceData.title}</span>
		  </div>
	  `;
	  experienceData.items.forEach(item => {
		  html += `
			  <div class="experience-item">
				  <div class="year">${item.year}</div>
				  <div class="job-title">${item.jobTitle}</div>
				  <div class="company">${item.company}</div>
				  ${item.description ? `<div class="description">${item.description}</div>` : ''}
			  </div>
		  `;
	  });
	  return html;
  }

  function generateEducation(educationData) {
	  let html = `
		  <div class="section-title">
			  <i class="fas fa-graduation-cap"></i>
			  <span>${educationData.title}</span>
		  </div>
	  `;
	  educationData.items.forEach(item => {
		  html += `
			  <div class="education-item">
				  <div class="year">${item.year}</div>
				  <div class="degree">${item.degree}</div>
				  <div class="school">${item.school}</div>
			  </div>
		  `;
	  });
	  return html;
  }

  document.getElementById('generate-pdf').addEventListener('click', function() {
	  try {
		  //cvData = JSON.parse(document.getElementById('json-input').value);
		  //console.log()
		  cvData = yamlToJson(document.getElementById("json-input").value);
		  console.log(cvData)
		  localStorage.setItem('cvData', document.getElementById("json-input").value);
		  loadCV(cvData);
	  } catch (error) {
		  alert('Invalid JSON input.'+error);
	  }
  });

  document.getElementById('print-cv').addEventListener('click', function() {
	  let originalDisplays = {};
	  let otherElements = document.body.querySelectorAll('body > *:not(#pdf-container)');

	  otherElements.forEach(element => {
		  originalDisplays[element.id || 'unknown'] = element.style.display;
		  element.style.display = 'none';
	  });

	  document.getElementById('pdf-container').style.display = 'block';

	  window.print();

	  otherElements.forEach(element => {
		  element.style.display = originalDisplays[element.id || 'unknown'] || '';
	  });

	  document.getElementById('pdf-container').style.display = 'block';
  });

  // Show pdf-container by default
  document.getElementById('pdf-container').style.display = 'block';
  loadCV(cvData);