import React, { useMemo, useState } from "react";
import {
  Phone,
  Calendar,
  Users,
  ArrowRightLeft,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  Settings,
  PlayCircle,
  Database,
  Workflow,
  Mic,
  KeyRound,
  Globe,
  Send,
  Bot,
  RefreshCcw,
  ShieldCheck,
} from "lucide-react";

const clinicTemplates = {
  chiropractic: {
    label: "Chiropractic",
    clinicName: "Peak Spine Chiropractic",
    city: "Chicago, IL",
    voiceAgentName: "Sarah",
    inboundGreeting:
      "Thank you for calling Peak Spine Chiropractic. This is Sarah, your scheduling assistant. How can I help you today?",
    leadFollowupIntro:
      "Hi, this is Sarah calling from Peak Spine Chiropractic. You had previously shown interest in scheduling an appointment with us, and I’m just reaching out to see if I can help you get that set up.",
    confirmationIntro:
      "Hello, this is Sarah calling from Peak Spine Chiropractic regarding your upcoming appointment.",
    kb: {
      hours: "Mon-Thu 8:00 AM-6:00 PM, Fri 8:00 AM-3:00 PM",
      location: "1847 West Belmont Ave, Chicago, IL 60657",
      parking: "Street parking is available nearby.",
      newPatients: "Yes, the clinic is currently accepting new patients.",
      firstVisit: "New patients should arrive 15 minutes early to complete intake paperwork.",
      services: ["Initial chiropractic consultation", "Follow-up adjustment", "Back pain assessment", "Neck pain follow-up"],
    },
    transcript: {
      inbound: [
        ["AI", "Thank you for calling Peak Spine Chiropractic. This is Sarah, your scheduling assistant. How can I help you today?"],
        ["Caller", "Hi, I’d like to book my first appointment for back pain."],
        ["AI", "Of course. Are you a new patient or an existing patient?"],
        ["Caller", "New patient."],
        ["AI", "Thanks. May I take your full name and best phone number?"],
        ["Caller", "John Carter, 312-555-1122."],
        ["AI", "Thank you. What day or time would suit you best for your first consultation?"],
        ["Caller", "Tomorrow afternoon if possible."],
        ["AI", "Perfect. I can offer 2:00 PM tomorrow. Would you like me to book that for you?"],
        ["Caller", "Yes please."],
        ["AI", "You’re all set for tomorrow at 2:00 PM. We’ll send a confirmation text shortly."],
      ],
      lead: [
        ["AI", "Hi, this is Sarah calling from Peak Spine Chiropractic. You had previously shown interest in scheduling an appointment with us, and I’m just reaching out to see if I can help you get that set up."],
        ["Lead", "Yes, I still want to come in next week."],
        ["AI", "Great. Would this be your first appointment with us?"],
        ["Lead", "Yes."],
        ["AI", "Perfect. What day works best for you?"],
        ["Lead", "Tuesday morning."],
        ["AI", "I can request that for you now and the office will confirm by text shortly."],
      ],
      confirmation: [
        ["AI", "Hello, this is Sarah calling from Peak Spine Chiropractic regarding your upcoming appointment."],
        ["Patient", "Okay."],
        ["AI", "I’m calling to confirm your appointment on April 22 at 2:00 PM. Will you still be able to attend?"],
        ["Patient", "Yes, I’ll be there."],
        ["AI", "Perfect. Thank you, and we’ll see you then."],
      ],
    },
  },
  physio: {
    label: "Physical Therapy",
    clinicName: "Motion Recovery Physical Therapy",
    city: "Houston, TX",
    voiceAgentName: "Emily",
    inboundGreeting:
      "Thank you for calling Motion Recovery Physical Therapy. This is Emily, your scheduling assistant. How can I help you today?",
    leadFollowupIntro:
      "Hi, this is Emily calling from Motion Recovery Physical Therapy. You had previously shown interest in scheduling an appointment with us, and I’m just checking in to see if I can help you get that set up.",
    confirmationIntro:
      "Hello, this is Emily calling from Motion Recovery Physical Therapy regarding your upcoming appointment.",
    kb: {
      hours: "Mon-Thu 7:30 AM-6:30 PM, Fri 7:30 AM-4:00 PM",
      location: "9200 Westheimer Rd, Suite 210, Houston, TX 77063",
      parking: "Free parking is available in the building lot.",
      newPatients: "Yes, the clinic is currently accepting new patients.",
      firstVisit: "New patients should arrive 15 minutes early and complete paperwork if possible.",
      services: ["New PT evaluation", "Follow-up treatment", "Sports injury rehab", "Post-surgery rehab"],
    },
    transcript: {
      inbound: [
        ["AI", "Thank you for calling Motion Recovery Physical Therapy. This is Emily, your scheduling assistant. How can I help you today?"],
        ["Caller", "I need to schedule an evaluation for a knee injury."],
        ["AI", "I’d be happy to help. Are you a new patient or an existing patient?"],
        ["Caller", "New patient."],
        ["AI", "Thank you. May I take your full name and best callback number?"],
        ["Caller", "Angela Brooks, 713-555-3211."],
        ["AI", "What day or time works best for your evaluation?"],
        ["Caller", "Thursday morning."],
        ["AI", "I can offer 9:30 AM Thursday. Would you like me to book that for you?"],
        ["Caller", "Yes."],
        ["AI", "You’re all set. We’ll send your confirmation by text shortly."],
      ],
      lead: [
        ["AI", "Hi, this is Emily calling from Motion Recovery Physical Therapy. You had previously shown interest in scheduling an appointment with us, and I’m just checking in to see if I can help you get that set up."],
        ["Lead", "Yes, I’m still interested in a sports rehab evaluation."],
        ["AI", "Great. Are you a new patient with us?"],
        ["Lead", "Yes."],
        ["AI", "Perfect. What day works best for you next week?"],
        ["Lead", "Wednesday afternoon."],
        ["AI", "Thanks. I’ve captured that and the clinic will text you shortly with the appointment details."],
      ],
      confirmation: [
        ["AI", "Hello, this is Emily calling from Motion Recovery Physical Therapy regarding your upcoming appointment."],
        ["Patient", "Yes?"],
        ["AI", "I’m calling to confirm your appointment on April 23 at 10:30 AM. Will you still be able to attend?"],
        ["Patient", "Yes, that works."],
        ["AI", "Wonderful. Thank you, and we’ll see you then."],
      ],
    },
  },
};

const toneOptions = [
  "Warm and professional",
  "Friendly and conversational",
  "Premium and clinical",
  "Calm and reassuring",
];

const viewModes = [
  { key: "inbound", label: "Inbound Booking" },
  { key: "lead", label: "Outbound Lead Booking" },
  { key: "confirmation", label: "Outbound Confirmation" },
];

function Card({ children, className = "" }) {
  return <div className={`bg-white rounded-2xl shadow-sm border border-slate-200 ${className}`}>{children}</div>;
}

function SectionTitle({ icon: Icon, title, subtitle }) {
  return (
    <div className="flex items-start gap-3 mb-4">
      <div className="p-2 rounded-xl bg-slate-100">
        <Icon className="w-5 h-5 text-slate-700" />
      </div>
      <div>
        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
        {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
      </div>
    </div>
  );
}

function Pill({ children }) {
  return <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700">{children}</span>;
}

export default function ClinicProfitsVoiceDemoApp() {
  const [clinicType, setClinicType] = useState("chiropractic");
  const [tone, setTone] = useState(toneOptions[0]);
  const [viewMode, setViewMode] = useState("inbound");
  const [bookingMode, setBookingMode] = useState("direct");
  const [clinicName, setClinicName] = useState(clinicTemplates.chiropractic.clinicName);
  const [forwardNumber, setForwardNumber] = useState("+1 (312) 555-0199");
  const [businessHours, setBusinessHours] = useState(clinicTemplates.chiropractic.kb.hours);
  const [agentName, setAgentName] = useState(clinicTemplates.chiropractic.voiceAgentName);

  const [retellApiKey, setRetellApiKey] = useState("");
  const [retellAgentId, setRetellAgentId] = useState("retell_agent_demo_001");
  const [retellPhoneNumber, setRetellPhoneNumber] = useState("+13125550148");
  const [retellWebhook, setRetellWebhook] = useState("https://yourapp.com/api/retell/webhook");

  const [ghlApiKey, setGhlApiKey] = useState("");
  const [ghlLocationId, setGhlLocationId] = useState("ghl_location_demo_001");
  const [ghlCalendarId, setGhlCalendarId] = useState("ghl_calendar_demo_001");
  const [ghlWorkflowId, setGhlWorkflowId] = useState("ghl_workflow_demo_001");
  const [ghlWebhook, setGhlWebhook] = useState("https://yourapp.com/api/ghl/webhook");

  const [simStatus, setSimStatus] = useState("idle");
  const [simulatedCaller, setSimulatedCaller] = useState(
    clinicType === "chiropractic" ? "John Carter" : "Angela Brooks"
  );
  const [simulatedPhone, setSimulatedPhone] = useState(
    clinicType === "chiropractic" ? "312-555-1122" : "713-555-3211"
  );
  const [simulatedReason, setSimulatedReason] = useState(
    clinicType === "chiropractic" ? "Back pain consultation" : "New PT evaluation for knee injury"
  );
  const [simulatedDate, setSimulatedDate] = useState("2026-04-22");
  const [simulatedTime, setSimulatedTime] = useState("2:00 PM");
  const [simulatedTranscript, setSimulatedTranscript] = useState([]);

  const template = clinicTemplates[clinicType];

  React.useEffect(() => {
    setClinicName(template.clinicName);
    setBusinessHours(template.kb.hours);
    setAgentName(template.voiceAgentName);
    setForwardNumber(clinicType === "chiropractic" ? "+1 (312) 555-0199" : "+1 (713) 555-0281");
    setSimulatedCaller(clinicType === "chiropractic" ? "John Carter" : "Angela Brooks");
    setSimulatedPhone(clinicType === "chiropractic" ? "312-555-1122" : "713-555-3211");
    setSimulatedReason(clinicType === "chiropractic" ? "Back pain consultation" : "New PT evaluation for knee injury");
  }, [clinicType]);

  const transcript = template.transcript[viewMode];

  const retellPrompt = useMemo(() => {
    const workflowLabel =
      viewMode === "inbound"
        ? "answer inbound calls, qualify callers, book appointments, answer admin questions, and forward to the clinic if needed"
        : viewMode === "lead"
        ? "call warm leads, re-engage them, qualify them, and move them toward a booked appointment or callback"
        : "call booked patients, confirm attendance, and capture confirm, reschedule, cancel, or callback outcomes";

    return `You are ${agentName}, the voice assistant for ${clinicName}, a ${template.label.toLowerCase()} clinic in the United States.\n\nYour tone is ${tone.toLowerCase()}.\n\nYour job is to ${workflowLabel}.\n\nBusiness hours: ${businessHours}.\nClinic location: ${template.kb.location}.\nTransfer / fallback number: ${forwardNumber}.\nBooking mode: ${bookingMode === "direct" ? "Direct booking" : "Human in the loop"}.\n\nImportant rules:\n- Do not give medical advice or diagnose.\n- Do not invent booking availability.\n- If the caller asks something outside your scope, offer to transfer to the clinic.\n- If the caller sounds urgent or unsafe, advise appropriate urgent medical help and flag the call.\n\nAdministrative information you may answer:\n- Office hours\n- Location\n- Parking\n- Whether new patients are accepted\n- What to expect on the first visit\n\nUse this greeting when the call starts: ${
      viewMode === "inbound"
        ? template.inboundGreeting
        : viewMode === "lead"
        ? template.leadFollowupIntro
        : template.confirmationIntro
    }`;
  }, [agentName, clinicName, template, tone, businessHours, forwardNumber, bookingMode, viewMode]);

  const ghlPayload = useMemo(() => {
    const base = {
      clinic_name: clinicName,
      clinic_type: template.label,
      workflow_type: viewMode,
      booking_mode: bookingMode,
      tags:
        viewMode === "inbound"
          ? ["voice-ai-demo", clinicType === "chiropractic" ? "chiro-demo" : "physio-demo", "inbound-call"]
          : viewMode === "lead"
          ? ["voice-ai-demo", clinicType === "chiropractic" ? "chiro-demo" : "physio-demo", "outbound-lead-call"]
          : ["voice-ai-demo", clinicType === "chiropractic" ? "chiro-demo" : "physio-demo", "outbound-confirmation-call"],
    };

    if (viewMode === "inbound") {
      return {
        ...base,
        opportunity_stage: bookingMode === "direct" ? "Appointment Booked" : "Booking Requested",
        sms_template:
          "Hi {{contact.first_name}}, your appointment request with {{custom_values.clinic_name}} has been received. We'll confirm by text shortly.",
        fields: ["new_or_existing_patient", "reason_for_call", "preferred_day", "preferred_time", "booking_status", "callback_required"],
      };
    }

    if (viewMode === "lead") {
      return {
        ...base,
        opportunity_stage: bookingMode === "direct" ? "Appointment Booked" : "Human Follow-Up Required",
        sms_template:
          "Hi {{contact.first_name}}, thanks for speaking with {{custom_values.clinic_name}}. We'll text you shortly with the next step for booking.",
        fields: ["patient_status", "interested_status", "requested_service", "preferred_day", "preferred_time", "callback_required"],
      };
    }

    return {
      ...base,
      opportunity_stage: "Appointment Confirmed",
      sms_template:
        "Hi {{contact.first_name}}, thanks for confirming your appointment with {{custom_values.clinic_name}}. Reply here if anything changes.",
      fields: ["appointment_date", "appointment_time", "confirmation_status", "reschedule_requested", "callback_required"],
    };
  }, [clinicName, template.label, viewMode, bookingMode, clinicType]);

  const clinicNotification = useMemo(() => {
    return {
      call_type: viewModes.find((m) => m.key === viewMode)?.label,
      clinic: clinicName,
      clinic_type: template.label,
      outcome:
        viewMode === "inbound"
          ? bookingMode === "direct"
            ? "Booked directly"
            : "Booking request captured"
          : viewMode === "lead"
          ? bookingMode === "direct"
            ? "Lead booked"
            : "Lead follow-up required"
          : "Appointment confirmed",
      follow_up: viewMode === "confirmation" ? "No further action unless patient changes plan" : bookingMode === "direct" ? "Confirmation SMS and CRM update" : "Human callback / review",
      forwarding_rule: `If needed, forward to ${forwardNumber}`,
    };
  }, [viewMode, clinicName, template.label, bookingMode, forwardNumber]);

  const simulatedExtracted = useMemo(() => {
    return {
      full_name: simulatedCaller,
      phone_number: simulatedPhone,
      reason: simulatedReason,
      date: simulatedDate,
      time: simulatedTime,
      status:
        viewMode === "inbound"
          ? bookingMode === "direct"
            ? "Appointment booked"
            : "Booking request captured"
          : viewMode === "lead"
          ? bookingMode === "direct"
            ? "Lead moved to booked"
            : "Lead requires human follow-up"
          : "Appointment confirmed",
    };
  }, [simulatedCaller, simulatedPhone, simulatedReason, simulatedDate, simulatedTime, viewMode, bookingMode]);

  const runSimulation = () => {
    setSimStatus("running");
    const base = template.transcript[viewMode];
    const patched = base.map(([speaker, line]) => {
      const updated = line
        .replace(/John Carter|Angela Brooks/g, simulatedCaller)
        .replace(/312-555-1122|713-555-3211/g, simulatedPhone)
        .replace(/back pain consultation|Back pain consultation|New PT evaluation for knee injury/g, simulatedReason)
        .replace(/April 22 at 2:00 PM|April 23 at 10:30 AM/g, `${simulatedDate} at ${simulatedTime}`);
      return [speaker, updated];
    });
    setTimeout(() => {
      setSimulatedTranscript(patched);
      setSimStatus("complete");
    }, 500);
  };

  const resetSimulation = () => {
    setSimStatus("idle");
    setSimulatedTranscript([]);
  };

  const retellWebhookExample = useMemo(() => {
    return {
      event: "call_completed",
      provider: "retell",
      agent_id: retellAgentId,
      from_number: retellPhoneNumber,
      to_number: simulatedPhone,
      workflow_type: viewMode,
      transcript_summary: clinicNotification.outcome,
      extracted_data: simulatedExtracted,
      ghl_location_id: ghlLocationId,
      clinic_name: clinicName,
    };
  }, [retellAgentId, retellPhoneNumber, simulatedPhone, viewMode, clinicNotification.outcome, simulatedExtracted, ghlLocationId, clinicName]);

  const ghlWorkflowExample = useMemo(() => {
    return {
      locationId: ghlLocationId,
      calendarId: ghlCalendarId,
      workflowId: ghlWorkflowId,
      action: viewMode === "confirmation" ? "update_confirmation_status_and_send_sms" : "create_or_update_contact_and_trigger_sms",
      contact: {
        name: simulatedCaller,
        phone: simulatedPhone,
      },
      customFields: simulatedExtracted,
      tags: ghlPayload.tags,
      pipelineStage: ghlPayload.opportunity_stage,
    };
  }, [ghlLocationId, ghlCalendarId, ghlWorkflowId, viewMode, simulatedCaller, simulatedPhone, simulatedExtracted, ghlPayload]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="max-w-7xl mx-auto p-6 md:p-8">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white border border-slate-200 px-3 py-1 text-sm text-slate-600 mb-3">
              <Mic className="w-4 h-4" /> Clinic Profits Demo App
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Voice AI Demo for Chiropractic & Physical Therapy Clinics</h1>
            <p className="text-slate-600 mt-2 max-w-3xl">
              A sales-ready demo app showing how Retell handles live voice calls while GoHighLevel powers CRM, workflows, SMS, and calendar actions in the backend.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Card className="px-4 py-3"><div className="text-xs text-slate-500">Use Cases</div><div className="text-xl font-semibold">3</div></Card>
            <Card className="px-4 py-3"><div className="text-xs text-slate-500">Clinic Types</div><div className="text-xl font-semibold">2</div></Card>
            <Card className="px-4 py-3"><div className="text-xs text-slate-500">Backend</div><div className="text-xl font-semibold">GHL</div></Card>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 space-y-6">
            <Card className="p-5">
              <SectionTitle icon={Settings} title="Demo Setup" subtitle="Configure the clinic, workflow, and backend behavior." />
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Clinic Type</label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {Object.entries(clinicTemplates).map(([key, value]) => (
                      <button
                        key={key}
                        onClick={() => setClinicType(key)}
                        className={`rounded-xl border px-3 py-2 text-sm text-left ${clinicType === key ? "bg-slate-900 text-white border-slate-900" : "bg-white border-slate-200"}`}
                      >
                        {value.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Workflow</label>
                  <div className="grid grid-cols-1 gap-2 mt-2">
                    {viewModes.map((mode) => (
                      <button
                        key={mode.key}
                        onClick={() => setViewMode(mode.key)}
                        className={`rounded-xl border px-3 py-2 text-sm text-left ${viewMode === mode.key ? "bg-slate-900 text-white border-slate-900" : "bg-white border-slate-200"}`}
                      >
                        {mode.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Tone</label>
                  <select value={tone} onChange={(e) => setTone(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm">
                    {toneOptions.map((item) => <option key={item}>{item}</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium">Booking Logic</label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <button onClick={() => setBookingMode("direct")} className={`rounded-xl border px-3 py-2 text-sm ${bookingMode === "direct" ? "bg-slate-900 text-white border-slate-900" : "bg-white border-slate-200"}`}>Direct GHL Booking</button>
                    <button onClick={() => setBookingMode("human")} className={`rounded-xl border px-3 py-2 text-sm ${bookingMode === "human" ? "bg-slate-900 text-white border-slate-900" : "bg-white border-slate-200"}`}>Human in the Loop</button>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Clinic Name</label>
                  <input value={clinicName} onChange={(e) => setClinicName(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="text-sm font-medium">Agent Name</label>
                  <input value={agentName} onChange={(e) => setAgentName(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="text-sm font-medium">Business Hours</label>
                  <input value={businessHours} onChange={(e) => setBusinessHours(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="text-sm font-medium">Fallback / Transfer Number</label>
                  <input value={forwardNumber} onChange={(e) => setForwardNumber(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm" />
                </div>
              </div>
            </Card>

            <Card className="p-5">
              <SectionTitle icon={KeyRound} title="Integration Settings" subtitle="Real keys, agent IDs, calendars, and webhooks for deployment." />
              <div className="space-y-5">
                <div>
                  <div className="flex items-center gap-2 mb-2"><Bot className="w-4 h-4 text-slate-600" /><label className="text-sm font-semibold">Retell</label></div>
                  <div className="space-y-3">
                    <input type="password" placeholder="Retell API Key" value={retellApiKey} onChange={(e) => setRetellApiKey(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm" />
                    <input placeholder="Retell Agent ID" value={retellAgentId} onChange={(e) => setRetellAgentId(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm" />
                    <input placeholder="Retell Phone Number" value={retellPhoneNumber} onChange={(e) => setRetellPhoneNumber(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm" />
                    <input placeholder="Retell Webhook URL" value={retellWebhook} onChange={(e) => setRetellWebhook(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2"><Workflow className="w-4 h-4 text-slate-600" /><label className="text-sm font-semibold">GoHighLevel</label></div>
                  <div className="space-y-3">
                    <input type="password" placeholder="GHL API Key" value={ghlApiKey} onChange={(e) => setGhlApiKey(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm" />
                    <input placeholder="GHL Location ID" value={ghlLocationId} onChange={(e) => setGhlLocationId(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm" />
                    <input placeholder="GHL Calendar ID" value={ghlCalendarId} onChange={(e) => setGhlCalendarId(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm" />
                    <input placeholder="GHL Workflow ID" value={ghlWorkflowId} onChange={(e) => setGhlWorkflowId(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm" />
                    <input placeholder="GHL Webhook URL" value={ghlWebhook} onChange={(e) => setGhlWebhook(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm" />
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Pill>{retellApiKey ? "Retell key added" : "Retell key pending"}</Pill>
                  <Pill>{ghlApiKey ? "GHL key added" : "GHL key pending"}</Pill>
                  <Pill>{bookingMode === "direct" ? "Direct calendar booking" : "Human review mode"}</Pill>
                </div>
              </div>
            </Card>

            <Card className="p-5">
              <SectionTitle icon={Database} title="Knowledge Base" subtitle="Sample clinic data to plug into Retell." />
              <div className="text-sm space-y-3 text-slate-700">
                <div><span className="font-semibold">Clinic:</span> {clinicName}</div>
                <div><span className="font-semibold">Location:</span> {template.kb.location}</div>
                <div><span className="font-semibold">Hours:</span> {template.kb.hours}</div>
                <div><span className="font-semibold">Parking:</span> {template.kb.parking}</div>
                <div><span className="font-semibold">New Patients:</span> {template.kb.newPatients}</div>
                <div><span className="font-semibold">First Visit:</span> {template.kb.firstVisit}</div>
                <div>
                  <span className="font-semibold">Services:</span>
                  <ul className="mt-2 list-disc pl-5 space-y-1">
                    {template.kb.services.map((service) => <li key={service}>{service}</li>)}
                  </ul>
                </div>
              </div>
            </Card>
          </div>

          <div className="lg:col-span-8 space-y-6">
            <Card className="p-5">
              <SectionTitle icon={PlayCircle} title="Mock Call Simulator" subtitle="Run a realistic test flow for inbound, lead follow-up, or confirmation." />
              <div className="grid md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="text-sm font-medium">Caller / Patient Name</label>
                  <input value={simulatedCaller} onChange={(e) => setSimulatedCaller(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="text-sm font-medium">Phone Number</label>
                  <input value={simulatedPhone} onChange={(e) => setSimulatedPhone(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="text-sm font-medium">Reason / Visit Type</label>
                  <input value={simulatedReason} onChange={(e) => setSimulatedReason(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="text-sm font-medium">Appointment Date</label>
                  <input value={simulatedDate} onChange={(e) => setSimulatedDate(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="text-sm font-medium">Appointment Time</label>
                  <input value={simulatedTime} onChange={(e) => setSimulatedTime(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm" />
                </div>
                <div className="flex items-end gap-2">
                  <button onClick={runSimulation} className="inline-flex items-center gap-2 rounded-xl bg-slate-900 text-white px-4 py-2 text-sm">
                    <PlayCircle className="w-4 h-4" /> Run Simulation
                  </button>
                  <button onClick={resetSimulation} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm">
                    <RefreshCcw className="w-4 h-4" /> Reset
                  </button>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-sm font-medium">Transcript Preview</div>
                      <div className="text-xs text-slate-500">Status: {simStatus}</div>
                    </div>
                    <div className="space-y-3 max-h-[360px] overflow-auto pr-1">
                      {(simulatedTranscript.length ? simulatedTranscript : transcript).map(([speaker, line], i) => (
                        <div key={i} className={`rounded-xl px-3 py-2 text-sm ${speaker === "AI" ? "bg-white border border-slate-200" : "bg-slate-900 text-white"}`}>
                          <div className="text-[11px] uppercase tracking-wide opacity-70 mb-1">{speaker}</div>
                          <div>{line}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 h-full">
                    <div className="text-sm font-medium mb-3">Extracted Data</div>
                    <pre className="whitespace-pre-wrap text-xs leading-6 text-slate-700 bg-white border border-slate-200 rounded-2xl p-4">{JSON.stringify(simulatedExtracted, null, 2)}</pre>
                    <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                      <Card className="p-3"><div className="text-slate-500 text-xs">Workflow</div><div className="font-semibold mt-1">{viewModes.find((m) => m.key === viewMode)?.label}</div></Card>
                      <Card className="p-3"><div className="text-slate-500 text-xs">Mode</div><div className="font-semibold mt-1">{bookingMode === "direct" ? "Direct Booking" : "Human Review"}</div></Card>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-5">
              <SectionTitle icon={Mic} title="Retell Agent Prompt" subtitle="Paste this into the active Retell agent for the selected workflow." />
              <pre className="whitespace-pre-wrap text-xs leading-6 text-slate-700 bg-slate-50 border border-slate-200 rounded-2xl p-4 max-h-[420px] overflow-auto">{retellPrompt}</pre>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-5">
                <SectionTitle icon={Send} title="Retell Webhook Example" subtitle="What your app would receive after a completed call." />
                <div className="text-xs text-slate-500 mb-3">POST {retellWebhook}</div>
                <pre className="whitespace-pre-wrap text-xs leading-6 text-slate-700 bg-slate-50 border border-slate-200 rounded-2xl p-4 max-h-[360px] overflow-auto">{JSON.stringify(retellWebhookExample, null, 2)}</pre>
              </Card>

              <Card className="p-5">
                <SectionTitle icon={Workflow} title="GHL Workflow Example" subtitle="How the call result maps into CRM, SMS, and pipeline actions." />
                <div className="text-xs text-slate-500 mb-3">POST {ghlWebhook}</div>
                <pre className="whitespace-pre-wrap text-xs leading-6 text-slate-700 bg-slate-50 border border-slate-200 rounded-2xl p-4 max-h-[360px] overflow-auto">{JSON.stringify(ghlWorkflowExample, null, 2)}</pre>
              </Card>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-5">
                <SectionTitle icon={Database} title="GHL Backend Mapping" subtitle="CRM, tags, workflow actions, and SMS behavior." />
                <pre className="whitespace-pre-wrap text-xs leading-6 text-slate-700 bg-slate-50 border border-slate-200 rounded-2xl p-4 max-h-[420px] overflow-auto">{JSON.stringify(ghlPayload, null, 2)}</pre>
              </Card>

              <Card className="p-5">
                <SectionTitle icon={ShieldCheck} title="Clinic Notification Summary" subtitle="The structured message the clinic team receives after the call." />
                <pre className="whitespace-pre-wrap text-xs leading-6 text-slate-700 bg-slate-50 border border-slate-200 rounded-2xl p-4 max-h-[420px] overflow-auto">{JSON.stringify(clinicNotification, null, 2)}</pre>
              </Card>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <Card className="p-5">
                <SectionTitle icon={Phone} title="Inbound" subtitle="Call answering and booking." />
                <ul className="text-sm text-slate-700 space-y-2">
                  <li>• Identify new vs existing patient</li>
                  <li>• Capture reason for call</li>
                  <li>• Book or request appointment</li>
                  <li>• Transfer to clinic if needed</li>
                </ul>
              </Card>
              <Card className="p-5">
                <SectionTitle icon={Users} title="Outbound Lead Booking" subtitle="Re-engage warm leads." />
                <ul className="text-sm text-slate-700 space-y-2">
                  <li>• Call unbooked leads</li>
                  <li>• Qualify quickly</li>
                  <li>• Move toward booking</li>
                  <li>• Trigger GHL follow-up</li>
                </ul>
              </Card>
              <Card className="p-5">
                <SectionTitle icon={Calendar} title="Confirmation Calls" subtitle="Reduce no-shows." />
                <ul className="text-sm text-slate-700 space-y-2">
                  <li>• Confirm attendance</li>
                  <li>• Capture reschedules</li>
                  <li>• Flag cancellations</li>
                  <li>• Sync the result into GHL</li>
                </ul>
              </Card>
            </div>

            <Card className="p-5">
              <SectionTitle icon={AlertCircle} title="Proposal Positioning" subtitle="How Clinic Profits should explain this to their client clinics." />
              <div className="grid md:grid-cols-2 gap-6 text-sm text-slate-700">
                <div>
                  <div className="font-semibold mb-2">What Clinic Profits is offering</div>
                  <p>
                    A Voice Conversion Layer for chiropractic and physical therapy clinics that answers inbound calls, follows up warm leads, confirms appointments, and keeps GHL as the backend system for texts, workflows, and CRM tracking.
                  </p>
                </div>
                <div>
                  <div className="font-semibold mb-2">Why this works</div>
                  <p>
                    Clinic Profits already generates patient demand. This demo shows how voice AI protects that demand at the phone layer so more enquiries become booked appointments and more booked appointments actually show up.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
