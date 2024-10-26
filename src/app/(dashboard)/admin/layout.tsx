import Sidebar from "@/app/components/nav/Sidebar";
import { Box } from "@chakra-ui/react";
import ClientSessionProvider from "../../../../utils/ClientSessionProvider";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <ClientSessionProvider>
        <Box bg={"#FAFAFB"}>
          <Sidebar>{children}</Sidebar>
        </Box>
      </ClientSessionProvider>
    </>
  );
};

export default AdminLayout;
