# GDG Website - Authentication Testing Guide

## Overview
This document guides you through testing the fixed authentication system to verify all bugs have been resolved.

---

## Pre-Test Checklist

- [ ] Backend running on `http://localhost:4565`
- [ ] Frontend running on `http://127.0.0.1:5500` or `http://localhost:5500`
- [ ] MongoDB connected and accessible
- [ ] Email service configured (check `.env` has valid EMAIL_USER and EMAIL_PASSWORD)
- [ ] All code fixes applied to both frontend and backend

---

## Test Scenarios

### Test 1: User Signup with OTP

**Steps:**
1. Open `http://127.0.0.1:5500/Frontend/login.html`
2. Click "Sign Up" tab
3. Fill in signup form:
   - **Full Name**: John Developer
   - **Email**: test.user@gmail.com (use actual email you have access to)
   - **Password**: TestPass123
   - **Confirm**: TestPass123
   - Check "I agree to Terms"
4. Click "Sign Up" button

**Expected Behavior:**
- Button should show "Creating Account..." and be disabled
- OTP email should arrive within 10 seconds
- Browser should prompt for OTP code
- Enter the 6-digit code from email
- After verification, should see success modal
- Redirect to index.html after 2 seconds
- User should be logged in (token in localStorage)

**Verify:**
```javascript
// In browser console:
localStorage.getItem('token')  // Should return JWT token
localStorage.getItem('user')   // Should return user object
```

**Expected Success Response:**
```json
{
  "message": "Email verified successfully",
  "token": "eyJ...",
  "refreshToken": "eyJ...",
  "user": {
    "id": "...",
    "username": "test.user",
    "email": "test.user@gmail.com",
    "firstName": "John",
    "lastName": "Developer",
    "isEmailVerified": true
  }
}
```

---

### Test 2: User Login with OTP

**Setup:**
- Submit the signup form from Test 1 (creates account)

**Steps:**
1. Open `http://127.0.0.1:5500/Frontend/login.html` (fresh page)
2. In Login tab, enter email: test.user@gmail.com
3. Click "Send OTP"
4. Check email for new OTP
5. Enter 6-digit code in OTP input field
6. Click "Verify OTP"

**Expected Behavior:**
- "Send OTP" button should disable and show "Sending..." text
- Success message: "OTP sent to: test.user@gmail.com"
- OTP input field appears with 10-minute timer
- "Verify OTP" button should disable during verification
- After OTP verified, success modal shows
- Redirects to index.html
- New tokens stored in localStorage

**Check Console:**
- No CORS errors
- No fetch failures
- No "setting 'textContent' on null" errors

---

### Test 3: User Login with Password

**Setup:**
- User from Test 1 must have account created and email verified

**Steps:**
1. Go to login page
2. Click "Login with Password" button
3. Enter email: test.user@gmail.com
4. Enter password: TestPass123
5. Click "Login with Password"

**Expected Behavior:**
- Login button disables and shows "Logging in..."
- No error messages
- Success modal appears
- Redirects to index.html
- Tokens in localStorage

**Error Case - Wrong Password:**
1. Enter wrong password: WrongPassword
2. Click login
3. Error shows: "Invalid credentials" or "Invalid email or password"
4. Form preserved (not cleared)

**Error Case - Unverified Email:**
1. Create account without completing OTP verification
2. Try password login
3. Error shows: "Please verify your email first. Use OTP login."

---

### Test 4: OTP Expiry

**Steps:**
1. Click "Send OTP" to get new OTP
2. Don't enter OTP code
3. Wait 10 minutes (or check database to set expiry to now)
4. Try to enter OTP and verify

**Expected Behavior:**
- Timer shows 0:00
- Form becomes disabled
- Submitting OTP shows error: "OTP has expired. Please request a new one."
- Button shows "← Use different email"
- Clicking it returns to Step 1

---

### Test 5: OTP Attempt Limit

**Steps:**
1. Click "Send OTP"
2. Enter WRONG OTP (e.g., 000000)
3. Click "Verify OTP"
4. Repeat wrong OTP 2 more times (total 3 attempts)

**Expected Behavior:**
- Attempt 1: Error "Invalid OTP. 2 attempts remaining."
- Attempt 2: Error "Invalid OTP. 1 attempt remaining."
- Attempt 3: Error "Too many incorrect attempts. Request a new OTP."
- Form returns to email step
- Must request new OTP to continue

---

### Test 6: Form Validation

**Test 6a - Invalid Email:**
1. Signup tab
2. Enter email: notanemail
3. Click Sign Up
4. Error below email field: "Please enter a valid email"
5. Form doesn't submit

**Test 6b - Password Too Short:**
1. Enter password: abc
2. Click Sign Up
3. Error: "Password must be at least 6 characters"

**Test 6c - Passwords Don't Match:**
1. Password: TestPass123
2. Confirm: TestPass456
3. Error: "Passwords do not match"

**Test 6d - Missing Terms:**
1. Fill all fields
2. Uncheck terms checkbox
3. Browser alert: "Please accept the Terms and Conditions"

---

### Test 7: OTP Resend

**Steps:**
1. Click "Send OTP"
2. Wait for Step 2 (OTP input) to appear
3. Click "Resend OTP" button
4. Button should disable and show countdown: "Resend OTP (30s)"
5. After 30 seconds, button enables again

**Expected Behavior:**
- New OTP sent to email
- Existing OTP becomes invalid
- Can enter new OTP and verify
- If old OTP entered, shows error

---

### Test 8: Dark Mode (Null Reference Bug Check)

**Steps:**
1. Open login.html (doesn't have dark mode button)
2. Wait for page to load fully
3. Check browser console

**Expected:**
- No console errors
- No "setting 'textContent' on null" message
- Page loads without problems

**Steps for index.html:**
1. Open index.html (has dark mode button)
2. Click moon icon to toggle dark mode
3. Check console

**Expected:**
- Dark mode toggles without errors
- Button text changes to ☀️ (sun) in dark mode
- Button text changes back to 🌙 (moon) in light mode

---

### Test 9: Dropdown Nav Menu

**Steps (Mobile or resized window):**
1. Open index.html on small screen (< 768px width)
2. Click hamburger menu ☰
3. Menu opens
4. Click a nav link
5. Menu closes

**Expected:**
- No console errors about hamburger or navMenu being null
- Menu toggles properly
- No crashes

---

### Test 10: API URL Construction

**Steps:**
1. Open developer console (F12)
2. Go to Network tab
3. Perform signup
4. Look for fetch requests

**Verify Correct URLs:**
- POST `http://localhost:4565/api/auth/send-otp` ✅
- POST `http://localhost:4565/api/auth/register` ✅
- NOT `http://localhost:4565/api/auth//auth/send-otp` ❌ (double /auth)

**Check CORS Headers:**
- Response should have:
  ```
  Access-Control-Allow-Origin: http://127.0.0.1:5500
  ```
- NOT:
  ```
  Access-Control-Allow-Origin: http://127.0.0.1:5500/Frontend/index.html
  ```

---

## Bug Fixes Verification

| Issue | How to Verify | Status |
|-------|--------------|--------|
| Mixing OTP & registration params | Signup works; OTP login works separately | ✅  |
| Password not trimmed | Login works with spaces around password | ✅ |
| Button spam multiple requests | Button disabled during API call | ✅ |
| Form data persists after signup | Form clears after successful submission | ✅ |
| Double /auth in URL | Network tab shows correct endpoint URL | ✅  |
| CORS origin mismatch | No CORS errors in console | ✅ |
| Null reference on login.html | No console errors about darkModeBtn |  |
| Empty password creation | Can't login with password of empty string | ✅ |

---

## Debug Commands

### Browser Console

```javascript
// Check authentication state
localStorage.getItem('token')
localStorage.getItem('user')
AuthAPI.isAuthenticated()

// Check current user
AuthAPI.getCurrentUser()

// Get token expiry
const token = localStorage.getItem('token')
const decoded = JSON.parse(atob(token.split('.')[1]))
new Date(decoded.exp * 1000)
```

### Backend Console

```bash
# Check MongoDB connection
curl http://localhost:4565/api/health

# Check logs
# Should show incoming requests to /auth endpoints
# Should show email being sent
```

---

## Common Failures & Solutions

| Symptom | Cause | Solution |
|---------|-------|----------|
| "CORS policy blocked" | Wrong FRONTEND_URL in .env | Update .env, restart backend |
| "Failed to send OTP" | Email credentials wrong | Check .env EMAIL_USER/PASSWORD |
| OTP never arrives | Email not configured | Set up Gmail app password |
| "OTP Required" error stays | OTP format invalid | Must be exactly 6 digits |
| "User not found" on OTP | User created before backend started | Re-run sendOTP |
| Token expires immediately | JWT_SECRET not set | Add to .env |
| Form never clears | JavaScript error in submit | Check console for exceptions |

---

## Performance Notes

- Frontend → Backend should take < 500ms for OTP send
- Email delivery typically < 5 seconds
- Total signup flow should complete in < 30 seconds

---

## Security Checklist

- [ ] Passwords are hashed (bcrypt)
- [ ] OTP is 6 random digits
- [ ] OTP expires after 10 minutes
- [ ] Max 3 OTP attempts per request
- [ ] Tokens use HTTP-only cookies (secure)
- [ ] JWT secret is strong
- [ ] CORS only allows frontend origin
- [ ] Password fields use type="password"

---

## Success Criteria

All tests pass ✅ when:
1. ✅ Users can sign  up with email → OTP → password
2. ✅ Users can login with email → OTP
3. ✅ Users can login with email + password
4. ✅ OTP expires and rate-limits work
5. ✅ Form validation prevents bad input
6. ✅ No console errors about null elements or CORS
7. ✅ Tokens stored correctly in localStorage
8. ✅ Dark mode works on all pages
9. ✅ Navigation menu works without errors
10. ✅ All API URLs are correctly constructed

