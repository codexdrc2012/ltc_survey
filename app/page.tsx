"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { CountryCodeSelect } from "@/components/CountryCodeSelect"

const formSchema = z.object({
  fullName: z.string().min(2, {
    message: "Le nom complet doit contenir au moins 2 caractères.",
  }),
  countryCode: z.string().min(1, {
    message: "Veuillez sélectionner un indicatif.",
  }),
  phoneNumber: z.string().min(1, {
    message: "Veuillez entrer un numéro de téléphone.",
  }),
  email: z.string().email({
    message: "Veuillez entrer une adresse e-mail valide.",
  }),
  program: z.string().min(1, {
    message: "Veuillez sélectionner un programme.",
  }),
  customProgram: z.string().optional(),
  joinClub: z.enum(["oui", "non"], {
    required_error: "Veuillez sélectionner une option.",
  }),
  suggestions: z.string().optional(),
})

export default function SurveyForm() {
  const [showCustomProgram, setShowCustomProgram] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      countryCode: "+1", // Set default country code to Canada
      phoneNumber: "",
      email: "",
      program: "",
      customProgram: "",
      joinClub: undefined,
      suggestions: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Check if required fields are filled
    if (!values.fullName || !values.countryCode || !values.phoneNumber || !values.program || !values.joinClub) {
      toast({
        title: "Erreur de validation",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      const fullPhoneNumber = `${values.countryCode}${values.phoneNumber}`
      const program = values.program === "Autre" ? values.customProgram : values.program

      // Format the message in a friendly manner
      const friendlyMessage = `
Bonjour! Nous avons reçu une nouvelle réponse à notre sondage. Voici les détails:

Nom: ${values.fullName}
Téléphone: ${fullPhoneNumber}
Email: ${values.email}
Programme: ${program}
Intéressé(e) à joindre le club: ${values.joinClub === "oui" ? "Oui" : "Non"}
${values.suggestions ? `Suggestions: ${values.suggestions}` : ""}

Lien du groupe WhatsApp: https://chat.whatsapp.com/I5YCOKWcjfWL5FKJM1XrCr

Merci de prendre le temps de traiter cette information. Bonne journée!
      `.trim()

      // Send data to the specified endpoint
      const response = await fetch("https://qavah-group.ovh/wabot/whatsapp/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          number: "+14384559713",
          message: friendlyMessage,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to send data to the specified endpoint")
      }

      const userMessage = `
Bonjour ${values.fullName}!

Merci pour votre intérêt dans le LaSalle Tech Club. Voici le lien pour rejoindre notre groupe WhatsApp:

https://chat.whatsapp.com/I5YCOKWcjfWL5FKJM1XrCr

Au plaisir de vous y retrouver!
`.trim()

      const userResponse = await fetch("https://qavah-group.ovh/wabot/whatsapp/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          number: fullPhoneNumber,
          message: userMessage,
        }),
      })

      if (!userResponse.ok) {
        throw new Error("Failed to send message to user")
      }

      router.push("/thank-you")
    } catch (error) {
      console.error("Error submitting form:", error)
      toast({
        title: "Erreur lors de la soumission",
        description: "Veuillez réessayer plus tard.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="text-center mb-8">
        <img
          src="https://firebasestorage.googleapis.com/v0/b/goodvibes-event.appspot.com/o/ltc%2Flogo.webp?alt=media&token=8a8977c3-d949-4565-b4d2-b71308c5e6f7"
          alt="Logo"
          className="mx-auto invert"
        />
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom complet *</FormLabel>
                <FormControl>
                  <Input placeholder="Entrez votre nom complet" {...field} className="bg-background text-foreground" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex space-x-4">
            <FormField
              control={form.control}
              name="countryCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Indicatif *</FormLabel>
                  <FormControl>
                    <CountryCodeSelect onValueChange={field.onChange} value={field.value} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Numéro de téléphone *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Entrez votre numéro de téléphone"
                      {...field}
                      className="bg-background text-foreground"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Entrez votre adresse e-mail"
                    {...field}
                    className="bg-background text-foreground"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="program"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Programme *</FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value)
                    setShowCustomProgram(value === "Autre")
                  }}
                >
                  <FormControl>
                    <SelectTrigger className="bg-background text-foreground">
                      <SelectValue placeholder="Sélectionnez un programme" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Technique Informatique - Programmation">
                      Technique Informatique - Programmation
                    </SelectItem>
                    <SelectItem value="Technique Informatique - Jeux video">
                      Technique Informatique - Jeux vidéo
                    </SelectItem>
                    <SelectItem value="Technique Informatique - reseau">Technique Informatique - Réseau</SelectItem>
                    <SelectItem value="Autre">Autre</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          {showCustomProgram && (
            <FormField
              control={form.control}
              name="customProgram"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Programme personnalisé *</FormLabel>
                  <FormControl>
                    <Input placeholder="Entrez votre programme" {...field} className="bg-background text-foreground" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          <FormField
            control={form.control}
            name="joinClub"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Êtes-vous intéressé à joindre le club ? *</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="oui" />
                      </FormControl>
                      <FormLabel className="font-normal">Oui</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="non" />
                      </FormControl>
                      <FormLabel className="font-normal">Non</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="suggestions"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Avez-vous des suggestions ?</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Entrez vos suggestions ici"
                    className="resize-none bg-background text-foreground"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Soumission..." : "Soumettre"}
          </Button>
        </form>
      </Form>
    </div>
  )
}

