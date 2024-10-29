declare var html2pdf: any;

interface ResumeData {
    name: string;
    email: string;
    contactNo: string;
    degree: string;
    school: string;
    gradYear: number;
    jobTitle: string;
    company: string;
    years: number;
    skills: string[];
}

document.addEventListener("DOMContentLoaded", () => {
    const resumeForm = document.getElementById("resumeForm") as HTMLFormElement;
    const skillsList = document.getElementById("skills-list") as HTMLUListElement;
    const addSkillButton = document.getElementById("add-skill") as HTMLButtonElement;
    const resumeOutput = document.getElementById("resumeOutput") as HTMLDivElement;
    const copyLinkButton = document.getElementById("copy-link-btn") as HTMLButtonElement;
    const downloadButton = document.getElementById("download-btn") as HTMLButtonElement;

    const skills: string[] = [];

    // Add skill event listener
    addSkillButton.addEventListener("click", () => {
        const skillInput = document.getElementById("skill") as HTMLInputElement;
        const skill = skillInput.value.trim();
        if (skill) {
            skills.push(skill);
            skillInput.value = '';
            updateSkillsList();
        }
    });

    function updateSkillsList() {
        skillsList.innerHTML = '';
        skills.forEach(skill => {
            const li = document.createElement("li");
            li.textContent = skill;
            skillsList.appendChild(li);
        });
    }

    resumeForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const resumeData: ResumeData = {
            name: (document.getElementById("name") as HTMLInputElement).value,
            email: (document.getElementById("email") as HTMLInputElement).value,
            contactNo: (document.getElementById("contactNo") as HTMLInputElement).value,
            degree: (document.getElementById("degree") as HTMLInputElement).value,
            school: (document.getElementById("school") as HTMLInputElement).value,
            gradYear: parseInt((document.getElementById("gradYear") as HTMLInputElement).value),
            jobTitle: (document.getElementById("jobTitle") as HTMLInputElement).value,
            company: (document.getElementById("company") as HTMLInputElement).value,
            years: parseInt((document.getElementById("years") as HTMLInputElement).value),
            skills: skills,
        };

        // Save to local storage
        localStorage.setItem(resumeData.name, JSON.stringify(resumeData));

        // Generate shareable link
        const shareableLink = `${window.location.origin}/review.html?username=${encodeURIComponent(resumeData.name)}`;
        copyLinkButton.setAttribute('data-link', shareableLink);

        // Display the resume output
        generateResumeOutput(resumeData);
    });

    function generateResumeOutput(data: ResumeData) {
        resumeOutput.innerHTML = `
            <h2>Resume</h2>
            <h3>Persnal Information</h3>
            <p>Name: ${data.name}</p>
            <p>Email: ${data.email}</p>
            <p>ContactNo: ${data.contactNo}</p>
            <h4>Education</h4>
            <p>${data.degree} from ${data.school} (Class of ${data.gradYear})</p>
            <h4>Work Experience</h4>
            <p>${data.jobTitle} at ${data.company} (${data.years} years)</p>
            <h4>Skills</h4>
            <ul>
                ${data.skills.map(skill => `<li>${skill}</li>`).join("")}
            </ul>
        `;
    }

    // Copy link to clipboard
    copyLinkButton.addEventListener("click", () => {
        const link = copyLinkButton.getAttribute('data-link');
        if (link) {
            navigator.clipboard.writeText(link).then(() => {
                alert('Link copied to clipboard!');
            }).catch(err => {
                console.error('Could not copy text: ', err);
            });
        }
    });

    // Download PDF button
    downloadButton.addEventListener("click", () => {
        const resumeElement = resumeOutput;
        const opt = {
            margin: 1,
            filename: "Resume.pdf",
            image: { type: "jpeg", quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
        };
        html2pdf().from(resumeElement).set(opt).save();
    });
});
