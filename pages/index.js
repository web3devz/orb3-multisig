import { Grid, Box } from "@mui/material";
import Form from "../components/Form";
import WalletConnected from "../components/WalletConnected";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <>
      <Box sx={{ mt: 3 }}>
        <WalletConnected />
      </Box>
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
        style={{ minHeight: "75vh" }}
      >
        <Form />
      </Grid>
      <Footer />
    </>
  );
}
