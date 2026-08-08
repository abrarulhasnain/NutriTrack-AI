import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { LoginForm } from "./LoginForm"
import { SignupForm } from "./SignupForm"

const premiumEase = [0.22, 1, 0.36, 1] as const

export function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false)

  const overlayVariants = {
    left: {
      x: ["100%", "60%", "0%"],
      scaleX: [1, 1.3, 1],
      scaleY: [1, 1.08, 1],
      borderRadius: [
        "45% 0% 0% 45% / 50% 0% 0% 50%",
        "50% 50% 50% 50% / 50% 50% 50% 50%",
        "0% 45% 45% 0% / 0% 50% 50% 0%",
      ],
      transition: { duration: 0.9, ease: premiumEase, times: [0, 0.5, 1] },
    },
    right: {
      x: ["0%", "60%", "100%"],
      scaleX: [1, 1.3, 1],
      scaleY: [1, 1.08, 1],
      borderRadius: [
        "0% 45% 45% 0% / 0% 50% 50% 0%",
        "50% 50% 50% 50% / 50% 50% 50% 50%",
        "45% 0% 0% 45% / 50% 0% 0% 50%",
      ],
      transition: { duration: 0.9, ease: premiumEase, times: [0, 0.5, 1] },
    },
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="relative w-full max-w-4xl h-[550px] bg-white rounded-2xl shadow-xl overflow-hidden">

        {/* Signup form - left half (revealed when isSignUp) */}
        <motion.div
          className="absolute top-0 left-0 w-1/2 h-full flex items-center justify-center px-10"
          animate={{
            opacity: isSignUp ? 1 : 0,
            x: isSignUp ? 0 : 80,
            scale: isSignUp ? 1 : 0.96,
          }}
          transition={{ duration: 0.55, ease: premiumEase }}
          style={{ pointerEvents: isSignUp ? "auto" : "none" }}
        >
          <SignupForm />
        </motion.div>

        {/* Login form - right half (revealed when !isSignUp) */}
        <motion.div
          className="absolute top-0 right-0 w-1/2 h-full flex items-center justify-center px-10"
          animate={{
            opacity: isSignUp ? 0 : 1,
            x: isSignUp ? -80 : 0,
            scale: isSignUp ? 0.96 : 1,
          }}
          transition={{ duration: 0.55, ease: premiumEase }}
          style={{ pointerEvents: isSignUp ? "none" : "auto" }}
        >
          <LoginForm />
        </motion.div>

        {/* Morphing liquid overlay */}
        <motion.div
          className="absolute top-0 w-1/2 h-full z-20 flex items-center justify-center text-white"
          style={{
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            transformOrigin: "center",
          }}
          animate={isSignUp ? "right" : "left"}
          variants={overlayVariants}
        >
          {!isSignUp ? (
            <motion.div
              key="signup-prompt"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="flex flex-col items-center gap-4 px-10 text-center"
            >
              <h2 className="text-3xl font-bold">New here?</h2>
              <p className="text-white/90">
                Join us today and discover a world of possibilities. Create your account in seconds!
              </p>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={{ duration: 0.25 }}>
                <Button
                  variant="outline"
                  onClick={() => setIsSignUp(true)}
                  className="rounded-full border-white text-white bg-transparent hover:bg-white hover:text-indigo-600 px-8"
                >
                  SIGN UP
                </Button>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="signin-prompt"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="flex flex-col items-center gap-4 px-10 text-center"
            >
              <h2 className="text-3xl font-bold">One of us?</h2>
              <p className="text-white/90">
                Already have an account? Sign in and pick up right where you left off.
              </p>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={{ duration: 0.25 }}>
                <Button
                  variant="outline"
                  onClick={() => setIsSignUp(false)}
                  className="rounded-full border-white text-white bg-transparent hover:bg-white hover:text-indigo-600 px-8"
                >
                  SIGN IN
                </Button>
              </motion.div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
