import React, { useState, Suspense, lazy } from "react";
import { Box, Container, Typography, Snackbar, Alert, Skeleton } from "@mui/material";
import cruxAPI from "./services/cruxAPI";
const InputURL = lazy(() => import("./components/InputURL"));
const OutputData = lazy(() => import("./components/OutputData"));

const App = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sort, setSort] = useState("asc");
  const [sortField, setSortField] = useState(null);
  const [error, setError] = useState(null);

  const impMetrics = [
    "largest_contentful_paint",
    "first_input_delay",
    "interaction_to_next_paint",
    "cumulative_layout_shift",
    "first_contentful_paint",
  ];

  const handleSearch = async (urls) => {
    try {
      setLoading(true);

      const trimUrls = urls.map((url) => {
        const trimmedUrl = url.trim();
        if (!/^https?:\/\//i.test(trimmedUrl)) {
          return `https://${trimmedUrl}`;
        }
        return trimmedUrl;
      });

      const response = await cruxAPI(trimUrls);
      const URLResponses = response.data.data; // access .data.data

      let finalData = [];

      URLResponses.forEach((UrlData, index) => {
        const url = UrlData.url;
        const metrics = UrlData?.record?.metrics;

        if (metrics && Object.keys(metrics).length > 0) {
          Object.entries(metrics)
            .filter(([key]) => impMetrics.includes(key))
            .forEach(([metricName, metric]) => {
              // Add Percentiles
              if (metric?.percentiles?.p75 !== undefined) {
                finalData.push({
                  url,
                  name: metricName,
                  value: metric.percentiles.p75,
                  type: "Percentile",
                });
              }

              // Add Histograms
              if (metric?.histogram?.length) {
                metric.histogram.forEach((hist, idx) => {
                  finalData.push({
                    url,
                    name: `${metricName} - bin ${idx + 1}`,
                    value: hist.density,
                    type: "Histogram",
                  });
                });
              }
            });
        } else {
          console.warn(`No important metrics found for URL: ${url}`);
        }
      });

      setData(finalData);
    } catch (error) {
      console.error("Error Fetching Data:", error);
      setError('Something went wrong while fetching data 😢');
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field) => {
    const fieldOrder = sortField === field && sort === "asc" ? "desc" : "asc";
    setSort(fieldOrder);
    setSortField(field);

    const sortedData = [...data].sort((a, b) => {
      if (typeof a[field] === "string") {
        return fieldOrder === "asc"
          ? a[field].localeCompare(b[field])
          : b[field].localeCompare(a[field]);
      }
      return fieldOrder === "asc" ? a[field] - b[field] : b[field] - a[field];
    });

    setData(sortedData);
  };

  return (
    <Container maxWidth="md" sx={{ mt: { xs: 2, md: 4 }, px: { xs: 2, md: 4 }, textAlign: "center" }}>
      <Typography sx={{ fontSize: { xs: "1.5rem", md: "2.5rem" } }} variant="h4">
        URL Report Dashboard
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 2, mb: 2 }}>
        <Suspense fallback={<Skeleton width={300} height={50} />}>
          <InputURL onSearch={handleSearch} setError={setError} />
        </Suspense>
      </Box>
      <Box>
        <Suspense fallback={<Skeleton width="100%" height={400} />}>
          <OutputData
            data={data}
            onSort={handleSort}
            setSortField={sortField}
            setSort={sort}
            loading={loading}
            impMetrics={impMetrics}
          />
        </Suspense>
      </Box>
      <Snackbar
        open={Boolean(error)}
        autoHideDuration={4000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={() => setError(null)} severity="error" sx={{ width: "100%" }}>
          {error}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default App;
