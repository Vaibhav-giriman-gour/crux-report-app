import React from "react";
import { Box, Skeleton } from "@mui/material";

const PageLoader = () => {
    return (
        <Box
            sx={{
                width: "100%",
                height: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 2,
                backgroundColor: "#f5f5f5",
            }}
        >
            <Skeleton variant="text" width="60%" height={60} />
            <Skeleton variant="rectangular" width="80%" height={300} />
            <Skeleton variant="rectangular" width="80%" height={300} />
            <Skeleton variant="text" width="40%" height={40} />
        </Box>
    );
};

export default PageLoader;
