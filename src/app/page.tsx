"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { pingServer } from "@/lib/api";
import { createSocket } from "@/lib/socket";

export default function Home() {
  const [apiStatus, setApiStatus] = useState("Connexion en cours...");
  const [socketStatus, setSocketStatus] = useState("Connexion en cours...");

  useEffect(() => {
    let active = true;

    pingServer()
      .then((message) => {
        if (active) setApiStatus(message);
      })
      .catch((error: unknown) => {
        if (active) {
          setApiStatus(
            `Erreur : ${error instanceof Error ? error.message : "inconnue"}`,
          );
        }
      });

    const socket = createSocket();
    socket.on("connect", () => setSocketStatus("Connecté"));
    socket.on("disconnect", () => setSocketStatus("Déconnecté"));
    socket.on("connect_error", (error: Error) =>
      setSocketStatus(`Erreur : ${error.message}`),
    );
    socket.connect();

    return () => {
      active = false;
      socket.disconnect();
    };
  }, []);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col gap-6 px-6 py-16">
      <header className="flex flex-col gap-2">
        <Badge variant="secondary" className="w-fit">
          Whispers
        </Badge>
        <h1 className="text-3xl font-semibold tracking-tight">
          Citations en vidéo, en image et en musique
        </h1>
        <p className="text-muted-foreground">
          Front Next.js — API NestJS + Fastify (cluster Node.js).
        </p>
      </header>

      <Separator />

      <section className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>API REST</CardTitle>
            <CardDescription>Proxy /api vers le serveur NestJS</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="font-mono text-sm">{apiStatus}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Socket.IO</CardTitle>
            <CardDescription>Temps réel, transport websocket</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="font-mono text-sm">{socketStatus}</p>
          </CardContent>
        </Card>
      </section>

      <Button variant="outline" className="w-fit">
        Thème clair / sombre
      </Button>
    </main>
  );
}
