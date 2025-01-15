import React,{useState} from 'react'

export default function Signup() {

 const [formData, setFormData] = useState({
    Email: '',
    Password: '',
  });


  return (


    <div>


          {/* Form Section */}
          Sign In To Your Account
          <div className="flex flex-col justify-center w-1/2 h-full space-y-6">
            <form className="space-y-6">
              <input
                type="text"
                name="Email"
                value={formData.Email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full px-4 py-3 font-bold border-b-2 border-gray-300 focus:outline-none"
              />
              <input
                type="text"
                name="Password"
                value={formData.Password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full px-4 py-3 font-bold border-b-2 border-gray-300 focus:outline-none"
              />
              <div> 
                <p>    
              Forget password
              </p>
              <button>
                Sign in
              </button>
              </div>
              <h>
                New to Ikukuestate
              </h>
              <p>
                Sign Up
              </p>
</form>
    </div>
    </div>
  )
}
