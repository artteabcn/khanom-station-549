"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MapPin, Phone, Mail, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { ContactSchema, type ContactInput } from "@/lib/validations/contact";
import { FacebookIcon, InstagramIcon, SOCIAL_LINKS } from "@/components/SocialIcons";
import { SITE } from "@/config/site";
import { useState } from "react";

interface ContactSectionProps {
  mapEmbedUrl?: string;
}

const FALLBACK_MAP_URL =
  "https://maps.google.com/maps?q=9.1560168,99.8604639&z=16&output=embed";

export default function ContactSection({ mapEmbedUrl }: ContactSectionProps): React.JSX.Element {
  const t = useTranslations("contact");
  const tf = useTranslations("contact.form");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({
    resolver: zodResolver(ContactSchema),
  });

  async function onSubmit(data: ContactInput): Promise<void> {
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed");
      setStatus("success");
      reset();
    } catch {
      setStatus("error");
    }
  }

  const contactItems = [
    { icon: MapPin, label: t("address") },
    { icon: Phone, label: t("phone"), href: `tel:${t("phone").replace(/\s/g, "")}` },
    { icon: Mail, label: t("email"), href: `mailto:${t("email")}` },
  ];

  return (
    <section id="contact" className="bg-brand-cream py-20">
      <div className="mx-auto max-w-7xl px-8">
        <div className="text-center">
          <p className="section-label">{t("label")}</p>
          <h2 className="section-title mt-3">{t("title")}</h2>
          <p className="section-subtitle mx-auto">{t("subtitle")}</p>
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-2">
          {/* Contact info */}
          <div className="flex flex-col gap-5">