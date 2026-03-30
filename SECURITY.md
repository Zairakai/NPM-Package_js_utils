# Security Policy

> This project follows the [Zairakai Global Security Policy][handbook-security].  
> Please refer to it for standard protections, response timeline, and contact information.

---

## 🔒 Reporting Vulnerabilities

| Channel           | Description                                              | Contact / Link                                                                       |
| :---------------- | :------------------------------------------------------- | :----------------------------------------------------------------------------------- |
| **GitLab Issues** | For non-sensitive issues (bugs, public vulnerabilities). | [Open Issue][issues]                                                                 |
| **Service Desk**  | Preferred channel for sensitive reports.                 | `contact-project+zairakai-npm-packages-js-utils-80189643-issue-@incoming.gitlab.com` |
| **Email**         | Alternative secure contact.                              | `security@the-white-rabbits.fr`                                                      |

Please **do not disclose vulnerabilities publicly** until they have been reviewed.

---

## 🛡️ Security Features

### Protection Layers

| Layer               | Security Protection                                  |
| :------------------ | :--------------------------------------------------- |
| **Static Analysis** | Strict TypeScript configs and ESLint security rules. |
| **CI Pipeline**     | Automated secret detection in GitLab CI.             |

---

## 🔍 Security Scope

`@zairakai/js-utils` provides runtime JavaScript utility functions (strings, numbers, arrays, validation):

- no external network calls
- no dynamic code execution (`eval`, `Function()`)
- isolated helpers with no side effects

You remain responsible for sanitizing any output rendered in HTML contexts.

---

[handbook-security]: https://gitlab.com/zairakai/handbook/-/blob/main/SECURITY.md
[issues]: https://gitlab.com/zairakai/npm-packages/js-utils/-/issues
