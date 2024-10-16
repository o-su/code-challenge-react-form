import "./App.css";
import { FormProvider } from "./form/FormContext";
import { MainForm } from "./form/MainForm";

function App() {
  return (
    <FormProvider>
      <MainForm />
    </FormProvider>
  );
}

export default App;
