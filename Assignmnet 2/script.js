/* ── Helpers ── */
  function setErr(id, msg) {
    const el = document.getElementById('err-' + id);
    const input = document.getElementById(id);
    el.querySelector('span').textContent = msg;
    if (msg) {
      el.classList.add('show');
      input.classList.add('is-error');
      input.classList.remove('is-valid');
    } else {
      el.classList.remove('show');
      input.classList.remove('is-error');
      input.classList.add('is-valid');
    }
  }

  function clearState(id) {
    const el = document.getElementById('err-' + id);
    const input = document.getElementById(id);
    el.classList.remove('show');
    input.classList.remove('is-error', 'is-valid');
  }

  /* ── Toggle show/hide password ── */
  function togglePw(id, btn) {
    const inp = document.getElementById(id);
    const isText = inp.type === 'text';
    inp.type = isText ? 'password' : 'text';
    btn.style.opacity = isText ? '1' : '0.5';
  }

  /* ── Password strength ── */
  const pwInp = document.getElementById('password');
  const bars  = [document.getElementById('s1'),document.getElementById('s2'),document.getElementById('s3'),document.getElementById('s4')];
  const colors = ['#ff6b6b','#ffb347','#ffd700','#3dd68c'];

  pwInp.addEventListener('input', () => {
    const v = pwInp.value;
    let score = 0;
    if (v.length >= 8)         score++;
    if (/[A-Z]/.test(v))       score++;
    if (/[0-9]/.test(v))       score++;
    if (/[^A-Za-z0-9]/.test(v)) score++;
    bars.forEach((b, i) => {
      b.style.background = i < score ? colors[score - 1] : 'var(--border)';
    });
    if (v) clearState('password');
  });

  /* ── Validate on blur ── */
  document.getElementById('fullname').addEventListener('blur', validateName);
  document.getElementById('email').addEventListener('blur', validateEmail);
  document.getElementById('password').addEventListener('blur', validatePassword);
  document.getElementById('confirm').addEventListener('blur', validateConfirm);
  document.getElementById('age').addEventListener('blur', validateAge);

  function validateName() {
    const v = document.getElementById('fullname').value.trim();
    if (!v) { setErr('fullname', 'Full name is required.'); return false; }
    if (v.split(/\s+/).filter(w => w).length < 2) { setErr('fullname', 'Please enter at least two words (first and last name).'); return false; }
    setErr('fullname', ''); return true;
  }

  function validateEmail() {
    const v = document.getElementById('email').value.trim();
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!v) { setErr('email', 'Email address is required.'); return false; }
    if (!re.test(v)) { setErr('email', 'Enter a valid email — e.g. you@example.com'); return false; }
    setErr('email', ''); return true;
  }

  function validatePassword() {
    const v = document.getElementById('password').value;
    if (!v) { setErr('password', 'Password is required.'); return false; }
    if (v.length < 8) { setErr('password', 'Must be at least 8 characters.'); return false; }
    if (!/[A-Z]/.test(v)) { setErr('password', 'Must include at least one uppercase letter.'); return false; }
    if (!/[0-9]/.test(v)) { setErr('password', 'Must include at least one number.'); return false; }
    if (!/[^A-Za-z0-9]/.test(v)) { setErr('password', 'Must include at least one special character (e.g. @, #, !).'); return false; }
    setErr('password', ''); return true;
  }

  function validateConfirm() {
    const pw  = document.getElementById('password').value;
    const cpw = document.getElementById('confirm').value;
    if (!cpw) { setErr('confirm', 'Please confirm your password.'); return false; }
    if (cpw !== pw) { setErr('confirm', 'Passwords do not match.'); return false; }
    setErr('confirm', ''); return true;
  }

  function validateAge() {
    const v = parseInt(document.getElementById('age').value, 10);
    if (!document.getElementById('age').value.trim()) { setErr('age', 'Age is required.'); return false; }
    if (isNaN(v) || v < 1) { setErr('age', 'Please enter a valid age.'); return false; }
    if (v < 18) { setErr('age', 'You must be 18 or older to register.'); return false; }
    if (v > 120) { setErr('age', 'Please enter a realistic age.'); return false; }
    setErr('age', ''); return true;
  }

  /* ── Form submit ── */
  document.getElementById('reg-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const n  = validateName();
    const em = validateEmail();
    const pw = validatePassword();
    const cp = validateConfirm();
    const ag = validateAge();

    if (!n || !em || !pw || !cp || !ag) {
      /* Collect first error for the alert */
      const msgs = [];
      if (!n)  msgs.push('• Full Name: must contain at least two words.');
      if (!em) msgs.push('• Email: must be a valid email address.');
      if (!pw) msgs.push('• Password: 8+ characters, uppercase, number, and special character required.');
      if (!cp) msgs.push('• Confirm Password: passwords must match.');
      if (!ag) msgs.push('• Age: must be 18 or older.');
      alert('Please fix the following errors:\n\n' + msgs.join('\n'));
      /* Scroll to first error */
      document.querySelector('.is-error')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    document.getElementById('success-overlay').classList.add('show');
  });

  function closeSuccess() {
    document.getElementById('success-overlay').classList.remove('show');
    document.getElementById('reg-form').reset();
    ['fullname','email','password','confirm','age'].forEach(clearState);
    document.querySelectorAll('.strength-bar span').forEach(b => b.style.background = 'var(--border)');
  }
