import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Authorized } from "./components/Authorized";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { AllOpportunities } from "./components/AllOpportunities";
import { OpportunityDetails } from "./components/OpportunityDetails";
import { UserDetails } from "./components/UserDetails";
import { CreateOpportunity } from "./components/CreateOpportunity";
import { EditOpportunity } from "./components/EditOpportunity";

export const ApplicationViews = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<Authorized />}>
          <Route path="/" element={<AllOpportunities />} />
          <Route path="/CreateOpportunity" element={<CreateOpportunity />} />
          <Route
            path="/EditOpportunity/:postId"
            element={<EditOpportunity />}
          />
          <Route path="/Opportunity/:postId" element={<OpportunityDetails />} />
          <Route path="/Profile/:userId" element={<UserDetails />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
