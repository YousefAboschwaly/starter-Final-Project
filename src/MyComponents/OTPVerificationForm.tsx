import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Loader2, AlertCircle } from 'lucide-react';
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface OTPVerificationFormProps {
  onSubmit: (otp: string) => Promise<void>;
  title?: string;
  subtitle?: string;
  buttonText?: string;
}

export function OTPVerificationForm({ 
  onSubmit, 
  title = "Verification Code", 
  subtitle = "Enter the verification code we sent to your email",
  buttonText = "Verify Code"
}: OTPVerificationFormProps) {
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      await onSubmit(otp);
    } catch (err: any) {
      setError(err.message || "Failed to verify code");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-center">{title}</CardTitle>
        <CardDescription className="text-center">{subtitle}</CardDescription>
      </CardHeader>
      <CardContent>
        <motion.form
          onSubmit={handleSubmit}
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex justify-center">
            <InputOTP
              maxLength={6}
              pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
              value={otp}
              onChange={(value: string) => setOtp(value)}
            >
              <InputOTPGroup className="gap-2">
                <InputOTPSlot index={0} ref={inputRef} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
              </InputOTPGroup>
            </InputOTP>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-500 text-sm flex items-center justify-center"
            >
              <AlertCircle className="w-4 h-4 mr-1" />
              {error}
            </motion.div>
          )}

          <Button type="submit" disabled={isLoading} className="w-full btn primary-grad">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              buttonText
            )}
          </Button>
        </motion.form>
      </CardContent>
    </Card>
  );
}
