import React from "react";
import { Container, Typography, Box } from "@mui/material";

const PrivacyPolicy = () => {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Privacy Policy
      </Typography>

      <Typography variant="body1" paragraph>
        <strong>Effective date:</strong> April 29, 2025
      </Typography>

      <Typography variant="body1" paragraph>
        PiggyPenny is committed to protecting your privacy. This Privacy Policy
        explains how we collect, use, and protect your information when you use our app.
      </Typography>

      <Box my={2}>
        <Typography variant="h6">1. Information We Collect</Typography>
        <Typography variant="body1" paragraph>
          - <strong>Google Account Info</strong>: When you sign in with Google, we collect your name and email address. <br />
          - <strong>Financial Data</strong>: We collect the income and expenses you input to help you track your finances. <br />
          - <strong>Usage Data</strong>: We may collect anonymous usage data to improve the app experience.
        </Typography>
      </Box>

      <Box my={2}>
        <Typography variant="h6">2. How We Use Your Information</Typography>
        <Typography variant="body1" paragraph>
          - To provide and improve the functionality of the app. <br />
          - To securely store your data using Firebase. <br />
          - To display your financial statistics and charts.
        </Typography>
      </Box>

      <Box my={2}>
        <Typography variant="h6">3. Data Storage</Typography>
        <Typography variant="body1" paragraph>
          All user data is securely stored on Google Firebase. Only you can access your financial data after logging in.
        </Typography>
      </Box>

      <Box my={2}>
        <Typography variant="h6">4. Data Sharing</Typography>
        <Typography variant="body1" paragraph>
          We do <strong>not</strong> sell, trade, or share your personal data with third parties.
        </Typography>
      </Box>

      <Box my={2}>
        <Typography variant="h6">5. User Rights</Typography>
        <Typography variant="body1" paragraph>
          You can: <br />
          - Access and update your data at any time. <br />
          - Delete your data by deleting your account.
        </Typography>
      </Box>

      <Box my={2}>
        <Typography variant="h6">6. Changes to This Policy</Typography>
        <Typography variant="body1" paragraph>
          We may update this privacy policy from time to time. Any changes will be posted on this page.
        </Typography>
      </Box>

      <Box my={2}>
        <Typography variant="h6">7. Contact</Typography>
        <Typography variant="body1" paragraph>
          If you have questions about this policy, please contact us at <strong>simone.lutero1@gmail.com</strong>.
        </Typography>
      </Box>
    </Container>
  );
};

export default PrivacyPolicy;
