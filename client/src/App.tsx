import { BrowserRouter as Router, Routes, Route } from "react-router";
import Ecommerce from "./pages/system/Dashboard/Ecommerce";
import SignIn from "./pages/system/AuthPages/SignIn";
import SignUp from "./pages/system/AuthPages/SignUp";
import NotFound from "./pages/system/OtherPage/NotFound";
import UserProfiles from "./pages/system/UserProfiles";
import Videos from "./pages/system/UiElements/Videos";
import Images from "./pages/system/UiElements/Images";
import Alerts from "./pages/system/UiElements/Alerts";
import Badges from "./pages/system/UiElements/Badges";
import Avatars from "./pages/system/UiElements/Avatars";
import Buttons from "./pages/system/UiElements/Buttons";
import LineChart from "./pages/system/Charts/LineChart";
import BarChart from "./pages/system/Charts/BarChart";
import Calendar from "./pages/system/Calendar";
import BasicTables from "./pages/system/Tables/BasicTables";
import FormElements from "./pages/system/Forms/FormElements";
import Blank from "./pages/system/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";

export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Dashboard Layout */}
          <Route element={<AppLayout />}>
            <Route index path="/" element={<Ecommerce />} />

            {/* Others Page */}
            <Route path="/profile" element={<UserProfiles />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/blank" element={<Blank />} />

            {/* Forms */}
            <Route path="/form-elements" element={<FormElements />} />

            {/* Tables */}
            <Route path="/basic-tables" element={<BasicTables />} />

            {/* Ui Elements */}
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/avatars" element={<Avatars />} />
            <Route path="/badge" element={<Badges />} />
            <Route path="/buttons" element={<Buttons />} />
            <Route path="/images" element={<Images />} />
            <Route path="/videos" element={<Videos />} />

            {/* Charts */}
            <Route path="/line-chart" element={<LineChart />} />
            <Route path="/bar-chart" element={<BarChart />} />
          </Route>

          {/* Auth Layout */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}
