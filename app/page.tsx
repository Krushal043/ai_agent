"use client";

import { useState } from "react";

import { authClient } from "@/lib/auth-client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Home() {

  const {
    data: session
  } = authClient.useSession()

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = () => {
    authClient.signUp.email({
      name,
      email,
      password
    }, {
      onSuccess: () => {
        window.alert("User created successfully");
      },
      onError: () => {
        window.alert("Failed to create user");
      }
    });
  }

  const onLogin = () => {
    authClient.signIn.email({
      email,
      password
    }, {
      onSuccess: () => {
        window.alert("User logged in successfully");
      },
      onError: () => {
        window.alert("Failed to log in");
      }
    });
  }

  if (session) {
    return <div className="p-4 flex flex-col gap-4">
      <p>Logged in as {session.user.name}</p>
      <Button onClick={() => authClient.signOut()}>Sign out</Button>
    </div>
  }

  return (
    <div className="flex flex-col gap-10">
      <div className="p-4 flex flex-col gap-4">
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
        />
        <Input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <Input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          type="password"
        />
        <Button onClick={onSubmit}>
          Create User
        </Button>
      </div>

      <div className="p-4 flex flex-col gap-4">
        <Input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <Input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          type="password"
        />
        <Button onClick={onLogin}>
          Login
        </Button>
      </div>
    </div>
  );
}
