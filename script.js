document.addEventListener("DOMContentLoaded", function () {
    var resumeForm = document.getElementById("resumeForm");
    var skillsList = document.getElementById("skills-list");
    var addSkillButton = document.getElementById("add-skill");
    var resumeOutput = document.getElementById("resumeOutput");
    var copyLinkButton = document.getElementById("copy-link-btn");
    var downloadButton = document.getElementById("download-btn");
    var skills = [];
    // Add skill event listener
    addSkillButton.addEventListener("click", function () {
        var skillInput = document.getElementById("skill");
        var skill = skillInput.value.trim();
        if (skill) {
            skills.push(skill);
            skillInput.value = '';
            updateSkillsList();
        }
    });
    function updateSkillsList() {
        skillsList.innerHTML = '';
        skills.forEach(function (skill) {
            var li = document.createElement("li");
            li.textContent = skill;
            skillsList.appendChild(li);
        });
    }
    resumeForm.addEventListener("submit", function (event) {
        event.preventDefault();
        var resumeData = {
            name: document.getElementById("name").value,
            email: document.getElementById("email").value,
            contactNo: document.getElementById("contactNo").value,
            degree: document.getElementById("degree").value,
            school: document.getElementById("school").value,
            gradYear: parseInt(document.getElementById("gradYear").value),
            jobTitle: document.getElementById("jobTitle").value,
            company: document.getElementById("company").value,
            years: parseInt(document.getElementById("years").value),
            skills: skills,
        };
        // Save to local storage
        localStorage.setItem(resumeData.name, JSON.stringify(resumeData));
        // Generate shareable link
        var shareableLink = "".concat(window.location.origin, "/review.html?username=").concat(encodeURIComponent(resumeData.name));
        copyLinkButton.setAttribute('data-link', shareableLink);
        // Display the resume output
        generateResumeOutput(resumeData);
    });
    function generateResumeOutput(data) {
        resumeOutput.innerHTML = "\n            <h2>Resume</h2>\n            <h3>Persnal Information</h3>\n            <p>Name: ".concat(data.name, "</p>\n            <p>Email: ").concat(data.email, "</p>\n            <p>ContactNo: ").concat(data.contactNo, "</p>\n            <h4>Education</h4>\n            <p>").concat(data.degree, " from ").concat(data.school, " (Class of ").concat(data.gradYear, ")</p>\n            <h4>Work Experience</h4>\n            <p>").concat(data.jobTitle, " at ").concat(data.company, " (").concat(data.years, " years)</p>\n            <h4>Skills</h4>\n            <ul>\n                ").concat(data.skills.map(function (skill) { return "<li>".concat(skill, "</li>"); }).join(""), "\n            </ul>\n        ");
    }
    // Copy link to clipboard
    copyLinkButton.addEventListener("click", function () {
        var link = copyLinkButton.getAttribute('data-link');
        if (link) {
            navigator.clipboard.writeText(link).then(function () {
                alert('Link copied to clipboard!');
            }).catch(function (err) {
                console.error('Could not copy text: ', err);
            });
        }
    });
    // Download PDF button
    downloadButton.addEventListener("click", function () {
        var resumeElement = resumeOutput;
        var opt = {
            margin: 1,
            filename: "Resume.pdf",
            image: { type: "jpeg", quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
        };
        html2pdf().from(resumeElement).set(opt).save();
    });
});
