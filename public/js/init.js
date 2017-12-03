const sections = document.querySelectorAll('.init-wrapper .section');

function showSection(sectionName) {
  sections.forEach((section) => {
    if (section.classList.contains(sectionName)) {
      section.classList.remove('hidden');
    } else {
      section.classList.add('hidden');
    }
  });
}

showSection('init-intro');
