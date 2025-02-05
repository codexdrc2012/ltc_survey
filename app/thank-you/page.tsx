"use client"
import Link from "next/link"
import { DotLottieReact } from "@lottiefiles/dotlottie-react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"

export default function ThankYouPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card className="w-full bg-background text-foreground">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Merci pour votre participation!</CardTitle>
          <CardDescription className="text-center">Votre réponse a été enregistrée avec succès.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center mb-4">
            Merci d'avoir complété ce formulaire, nous serons ravis de vous compter parmi nous dans nos prochaines
            séances.
          </p>
          <p className="text-center mb-4">
            Vous recevrez un lien WhatsApp où vous aurez tous les détails et programmes de la LTC. Merci et à bientôt!
          </p>
          <div className="mb-6 flex justify-center">
            <DotLottieReact
              src="https://lottie.host/c15e38aa-68de-436a-aeb3-f2e96fe74a54/uAwDVt5h7G.lottie"
              loop
              autoplay
              style={{ width: "200px", height: "200px" }}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link href="https://lasallecollege.lcieducation.com/">
            <Button variant="outline">Retour à l'accueil</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}

