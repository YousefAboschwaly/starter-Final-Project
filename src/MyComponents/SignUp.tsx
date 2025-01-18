import  { useContext } from "react"
import { Card } from "@/components/ui/card"
import { RegisterForm } from "./RegisterForm"
import { ISignUpForm } from "./RegisterForm"
import { UserContext } from '../Contexts/UserContext'
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { Button } from "@/components/ui/button"
import google from '../../public/Google.png'
import facebook from '../../public/Facebook.png'

export default function SignUp() {
  const userContext = useContext(UserContext);
  if (!userContext) {
    throw new Error("UserContext must be used within a UserContextProvider");
  }
  let navigate = useNavigate()

  const handleSignup = async (formValues: ISignUpForm) => {
    console.log("Form values", formValues)
    try {
      const { rePassword, ...dataToSend } = formValues;

      // Only include governorate and city if they have values
      if (!dataToSend.governorate?.id) delete dataToSend.governorate;
      if (!dataToSend.city?.id) delete dataToSend.city;
      if (!dataToSend.phone) delete dataToSend.phone;
      console.log("data will be send to API", dataToSend)

      const { data } = await axios.post(
        `https://dynamic-mouse-needlessly.ngrok-free.app/api/v1/auth/register`,
        dataToSend,
        {
          headers: {
            "Accept-Language": "en",
          },
        }
      )
      if (data.success) {
        navigate(`/access-account/${formValues.email}`)
      }
    } catch (error) {
      throw error;
    }
  }

  return (
    <div className="flex-1 flex items-center justify-center bg-background">
      <Card className="w-full max-w-md p-6">
        <RegisterForm onSubmit={handleSignup} userType={{ id: 7, code: "GENERAL_USER" }} btnText={'Sign Up'}      initialValues={{}}
        onChange={() => {}} >
          <>
          <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
        </div>
      </div>

      <div className="grid gap-2">
        <Button variant="outline" className="w-full btn font-medium">
          <img
            src={google}
            alt="Google"
            className="mr-2 w-6 h-6"
          />
          Continue with Google
        </Button>
        <Button variant="outline" className="w-full btn font-medium">
          <img
            src={facebook}
            alt="Facebook"
            className="mr-2 w-6 h-6"
          />
          Continue with Facebook
        </Button>
      </div>
          </>
          
        </RegisterForm>
      </Card>
    </div>
  )
}

