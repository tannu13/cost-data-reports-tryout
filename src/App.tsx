import "./App.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import CloudInstancesReport from "./CloudInstancesReport";

function App() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <CloudInstancesReport />
    </QueryClientProvider>
  );
}

export default App;
