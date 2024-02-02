import { Box, Container, Link, Typography } from "@material-ui/core";
import React from "react";

const Footer = () => {
  return (
    <div>
      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: "auto",
          backgroundColor: (theme) =>
            theme.palette.mode === "light"
              ? theme.palette.grey[200]
              : theme.palette.grey[800],
        }}
      >
        <Container maxWidth="sm">
          <Typography align="center" variant="body1">
            Made with ❤ by{" "}
            <Link href="https://twitter.com/crypto063" underline="hover">
              rukmani
            </Link>
          </Typography>
          {/* <Copyright /> */}
        </Container>
      </Box>
    </div>
  );
};

export default Footer;
