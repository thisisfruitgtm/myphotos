# Security Policy

## 🔒 Security Features

MyPhoto implements several security measures to protect your data:

### Authentication & Authorization

- **Password Hashing**: Bcrypt with 10 salt rounds
- **Session Management**: HTTP-only cookies with 7-day expiration
- **Session Tokens**: 32-byte cryptographically random tokens
- **Route Protection**: Middleware guards all protected routes

### Data Protection

- **SQL Injection**: Prisma ORM with parameterized queries
- **XSS Prevention**: React's built-in escaping + Content Security
- **CSRF Protection**: Built-in Next.js CSRF protection
- **Password Protection**: Optional passwords on photos and categories

### HTTP Security Headers

- `X-Frame-Options: DENY` - Prevents clickjacking
- `X-Content-Type-Options: nosniff` - Prevents MIME sniffing
- `X-XSS-Protection: 1; mode=block` - XSS filter
- `Referrer-Policy: strict-origin-when-cross-origin` - Referrer control

### File Upload Security

- **File Type Validation**: Only image files accepted
- **Size Limits**: Configurable upload size limits
- **Unique Filenames**: Random hex names prevent collisions
- **Directory Isolation**: Uploads stored in dedicated directory

## 🚨 Reporting a Vulnerability

If you discover a security vulnerability, please follow these steps:

### DO NOT

- ❌ Open a public GitHub issue
- ❌ Discuss the vulnerability in public forums
- ❌ Share details on social media

### DO

1. ✅ Email the maintainers privately
2. ✅ Provide detailed information:
   - Type of vulnerability
   - Affected versions
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

3. ✅ Wait for acknowledgment (24-48 hours)
4. ✅ Allow reasonable time for fix (90 days)

## 🛡️ Security Best Practices

### For Users

1. **Strong Passwords**
   - Use unique, complex passwords
   - Minimum 12 characters recommended
   - Mix of letters, numbers, symbols

2. **Session Secret**
   - Generate random secret (32+ characters)
   - Never commit to version control
   - Rotate periodically

3. **Database Security**
   - Use PostgreSQL in production
   - Keep database credentials secure
   - Regular backups
   - Enable SSL connections

4. **HTTPS**
   - Always use HTTPS in production
   - Use services like Let's Encrypt
   - Enable HSTS header

5. **Updates**
   - Keep dependencies updated
   - Monitor security advisories
   - Apply patches promptly

### For Developers

1. **Environment Variables**
   ```bash
   # Never commit these
   DATABASE_URL="..."
   SESSION_SECRET="..."
   ```

2. **Input Validation**
   - Validate all user inputs
   - Sanitize file uploads
   - Check file types and sizes

3. **Error Handling**
   - Don't expose stack traces
   - Log errors securely
   - Generic error messages to users

4. **Rate Limiting**
   - Implement rate limiting for APIs
   - Protect login endpoints
   - Prevent brute force attacks

5. **Dependency Scanning**
   ```bash
   npm audit
   npm audit fix
   ```

## 🔧 Configuration Hardening

### Production Environment

1. **Environment Variables**
   ```env
   NODE_ENV=production
   DATABASE_URL=postgresql://...
   SESSION_SECRET=<strong-random-secret>
   ```

2. **Next.js Configuration**
   ```javascript
   // next.config.mjs
   const nextConfig = {
     poweredByHeader: false,
     reactStrictMode: true,
   };
   ```

3. **Database**
   - Enable SSL
   - Use connection pooling
   - Implement backup strategy
   - Restrict network access

4. **Server**
   - Use firewall
   - Disable unnecessary services
   - Keep OS updated
   - Monitor logs

## 📋 Security Checklist

Before deploying to production:

- [ ] Change default `SESSION_SECRET`
- [ ] Use PostgreSQL instead of SQLite
- [ ] Enable HTTPS
- [ ] Set secure environment variables
- [ ] Configure CORS properly
- [ ] Enable rate limiting
- [ ] Setup logging and monitoring
- [ ] Configure backup strategy
- [ ] Review file upload limits
- [ ] Test authentication flows
- [ ] Audit dependencies (`npm audit`)
- [ ] Setup error monitoring
- [ ] Configure firewall rules
- [ ] Enable automatic security updates

## 🔄 Update Policy

- **Critical**: Patched within 24 hours
- **High**: Patched within 7 days
- **Medium**: Patched in next minor release
- **Low**: Patched in next major release

## 📚 Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js Security](https://nextjs.org/docs/app/building-your-application/configuring/security)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [Prisma Security](https://www.prisma.io/docs/guides/security)

## 🆘 Emergency Contacts

For critical security issues:
- Email: [Create an email]
- Response Time: 24-48 hours

## 📝 Disclosure Policy

- Report received: Acknowledge within 48 hours
- Issue validated: Update reporter within 7 days
- Fix developed: Test and validate
- Release: Deploy security patch
- Public disclosure: After fix is deployed (90 days max)

---

Thank you for helping keep MyPhoto secure! 🔒
