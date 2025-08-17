document.addEventListener('DOMContentLoaded', function () {
  const submitBtn = document.getElementById('submitBtn');
  const quizForm = document.getElementById('quizForm');
  const submitMessage = document.getElementById('submitMessage');
  const resultDiv = document.getElementById('result');
  const questions = document.querySelectorAll('.question');

  // Scroll progress bar
  window.addEventListener('scroll', function () {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      document.getElementById('scrollBar').style.width = scrollPercent + '%';

      // Fade-in questions on scroll
      questions.forEach((q, index) => {
          const rect = q.getBoundingClientRect();
          if (rect.top < window.innerHeight - 100) { // when near viewport
              q.style.opacity = 1;
              q.style.transform = 'translateY(0)';
              // Stagger options animation
              const labels = q.querySelectorAll('.options label');
              labels.forEach((label, i) => {
                  label.style.opacity = 1;
                  label.style.transform = 'translateY(0)';
                  label.style.transitionDelay = `${i * 0.2}s`;
              });
          }
      });
  });

  const answers = {
      q1: 'b', q2: 'b', q3: 'c', q4: 'b', q5: 'b',
      q6: 'b', q7: 'a', q8: 'a', q9: 'b', q10: 'b'
  };

  // Answered indicator
  let answeredIndicator = document.createElement('div');
  answeredIndicator.id = 'answeredIndicator';
  answeredIndicator.style.background = '#f0f0f0';
  answeredIndicator.style.padding = '8px 16px';
  answeredIndicator.style.borderRadius = '6px';
  answeredIndicator.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
  answeredIndicator.style.marginBottom = '10px';
  answeredIndicator.style.textAlign = 'center';
  quizForm.insertBefore(answeredIndicator, submitBtn);

  submitBtn.disabled = true;

  // Enable submit when all questions answered
  quizForm.addEventListener('change', function () {
      let answeredCount = 0;
      for (let key in answers) {
          if (quizForm.querySelector(`input[name="${key}"]:checked`)) answeredCount++;
      }

      if (answeredCount === Object.keys(answers).length) {
          submitBtn.disabled = false;
          answeredIndicator.textContent = "✅ You answered all questions!";
          answeredIndicator.style.color = "green";
          setTimeout(() => { answeredIndicator.style.display = "none"; }, 2000);
      } else {
          submitBtn.disabled = true;
          answeredIndicator.style.display = "block";
          answeredIndicator.textContent = "⚠️ Please answer all questions.";
          answeredIndicator.style.color = "orange";
      }
  });

  // Submit quiz and show score
  submitBtn.addEventListener('click', function () {
      let score = 0;
      for (let key in answers) {
          const questionDiv = quizForm.querySelector(`.question[data-q="${key}"]`);
          const selected = questionDiv.querySelector(`input[name="${key}"]:checked`);

          questionDiv.querySelectorAll('label').forEach(label => label.classList.remove('correct', 'wrong'));

          if (selected) {
              if (selected.value === answers[key]) {
                  score++;
                  selected.parentElement.classList.add('correct');
              } else {
                  selected.parentElement.classList.add('wrong');
                  questionDiv.querySelector(`input[value="${answers[key]}"]`).parentElement.classList.add('correct');
              }
          }
      }

      submitMessage.textContent = "✅ Your answers are successfully submitted!";
      setTimeout(() => {
          resultDiv.textContent = `🎉 You scored ${score} out of 10!`;
          resultDiv.style.fontSize = "22px";
          resultDiv.style.fontWeight = "bold";
          resultDiv.style.color = "#0066cc";
      }, 500);
  });

  // Trigger initial scroll event to animate questions in viewport
  window.dispatchEvent(new Event('scroll'));
});
