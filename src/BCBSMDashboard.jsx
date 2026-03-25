import { useState, useMemo, useCallback } from "react";

const INITIAL_ENTRIES = [
  {
    id: 1,
    date: "2026-03-04",
    source: "Detroit News",
    sourceType: "news",
    channel: "media",
    headline: "Blue Cross, Michigan Medicine dispute puts 300K patients up in the air",
    frameAdoption: "mm",
    sentiment: "negative_bcbs",
    patientStory: true,
    blameDirection: "bcbs",
    reachEstimate: "high",
    notes: "Lead with 300K patients affected. Both sides quoted but MM rebuttal gets last word.",
  },
  {
    id: 2,
    date: "2026-03-05",
    source: "WNEM / WILX",
    sourceType: "tv",
    channel: "media",
    headline: "Michigan Medicine warns it may stop taking some Blue Cross plans",
    frameAdoption: "balanced",
    sentiment: "neutral",
    patientStory: false,
    blameDirection: "both",
    reachEstimate: "medium",
    notes: "Straight news. Both 44% and 30% claims presented without challenge.",
  },
  {
    id: 3,
    date: "2026-03-05",
    source: "WXYZ",
    sourceType: "tv",
    channel: "media",
    headline: "Michigan Medicine to drop some Blue Cross plans if deal not reached",
    frameAdoption: "mm",
    sentiment: "negative_bcbs",
    patientStory: true,
    blameDirection: "bcbs",
    reachEstimate: "high",
    notes: "14yo Crohn's patient story. Mother quote: 'I freaked out.' Very sympathetic to MM.",
  },
  {
    id: 4,
    date: "2026-03-04",
    source: "BCBSM (mibluedaily.com)",
    sourceType: "owned",
    channel: "media",
    headline: "What's Behind the UM Health System Contract Dispute with Blue Cross?",
    frameAdoption: "bcbs",
    sentiment: "negative_mm",
    patientStory: false,
    blameDirection: "mm",
    reachEstimate: "medium",
    notes: "Owned media. Frames MM as demanding 44% hike. Positions BCBS as affordability champion.",
  },
  {
    id: 5,
    date: "2026-03-10",
    source: "Michigan Advance",
    sourceType: "news",
    channel: "media",
    headline: "Contract dispute creates concerns among patients",
    frameAdoption: "mm",
    sentiment: "negative_bcbs",
    patientStory: true,
    blameDirection: "bcbs",
    reachEstimate: "medium",
    notes: "MSU expert says MM has 'extremely sympathetic case.' BCBS has 70% market power framing.",
  },
  {
    id: 6,
    date: "2026-03-10",
    source: "Crain's Detroit Business",
    sourceType: "news",
    channel: "media",
    headline: "What's behind Blue Cross-Michigan Medicine contract dispute",
    frameAdoption: "balanced",
    sentiment: "neutral",
    patientStory: false,
    blameDirection: "both",
    reachEstimate: "high",
    notes: "CEO interviews from both sides. Most balanced coverage. Notes MM $233M operating income.",
  },
  {
    id: 7,
    date: "2026-03-19",
    source: "Detroit News",
    sourceType: "news",
    channel: "media",
    headline: "UM interim president disputes Blue Cross contract fight claims",
    frameAdoption: "mm",
    sentiment: "negative_bcbs",
    patientStory: false,
    blameDirection: "bcbs",
    reachEstimate: "high",
    notes: "University president escalation. Accuses BCBS of 'not telling the full truth.'",
  },
  {
    id: 8,
    date: "2026-03-23",
    source: "WEMU",
    sourceType: "radio",
    channel: "media",
    headline: "Michigan Medicine - BCBSM still fighting over new contract",
    frameAdoption: "mm",
    sentiment: "negative_bcbs",
    patientStory: false,
    blameDirection: "bcbs",
    reachEstimate: "low",
    notes: "NPR affiliate. Quotes president saying BCBS 'shared inaccuracies and untrue claims.'",
  },
  // === SOCIAL / FORUM ENTRIES ===
  {
    id: 9,
    date: "2026-03-05",
    source: "Threads (@michellewhisks)",
    sourceType: "social",
    channel: "social",
    headline: "Viral thread: 75+ likes, 60+ replies on BCBSM member notice",
    frameAdoption: "mm",
    sentiment: "negative_bcbs",
    patientStory: true,
    blameDirection: "bcbs",
    reachEstimate: "medium",
    notes: "High engagement. Dominant themes: 'BCBS is the bad guy,' 'I will leave BCBS,' threats to switch insurers. Some 'both sides wrong' takes but minority. CEO pay criticism. Multiple users say 'BCBS is the problem in this scenario.'",
  },
  {
    id: 10,
    date: "2026-03-05",
    source: "Threads (various replies)",
    sourceType: "social",
    channel: "social",
    headline: "Users threaten to leave BCBS, demand single-payer",
    frameAdoption: "mm",
    sentiment: "negative_bcbs",
    patientStory: false,
    blameDirection: "bcbs",
    reachEstimate: "low",
    notes: "'I'm not leaving my doctors, but I will leave BCBS.' 'Incandescent with rage.' Single-payer calls. One user: 'look up what the BCBS CEO is paid - even though its deemed nonprofit.'",
  },
  {
    id: 11,
    date: "2026-03-06",
    source: "Threads (dissenting view)",
    sourceType: "social",
    channel: "social",
    headline: "Minority take: both sides wrong, hospitals overcharge",
    frameAdoption: "balanced",
    sentiment: "neutral",
    patientStory: false,
    blameDirection: "both",
    reachEstimate: "low",
    notes: "'Is BCBS partly wrong? 100%, but these hospitals OVERCHARGE for services. Have you ever asked what the cash price for a service is?' — only dissenting view in thread, but present.",
  },
  {
    id: 12,
    date: "2026-03-05",
    source: "Reddit r/AnnArbor (referenced in Threads)",
    sourceType: "social",
    channel: "social",
    headline: "Cross-posted from r/AnnArbor — community discussion",
    frameAdoption: "mm",
    sentiment: "negative_bcbs",
    patientStory: true,
    blameDirection: "bcbs",
    reachEstimate: "medium",
    notes: "Referenced in Threads viral post. Panic among MM patients with BCBS. 'All my care is through MM and I have BCBS.' Community rallying around provider.",
  },
  {
    id: 13,
    date: "2026-03-05",
    source: "Threads (patient panicking)",
    sourceType: "social",
    channel: "social",
    headline: "Patient: 'I'm panicking. All my care is through MM and I have BCBS'",
    frameAdoption: "mm",
    sentiment: "negative_bcbs",
    patientStory: true,
    blameDirection: "bcbs",
    reachEstimate: "low",
    notes: "Raw patient fear. Blame directed at BCBS. Another user: 'how many people have died due to their greed?'",
  },
  {
    id: 14,
    date: "2026-03-05",
    source: "Social media (MM #KeepMichiganMedicine campaign)",
    sourceType: "social",
    channel: "social",
    headline: "MM launches organized social media campaign with hashtag",
    frameAdoption: "mm",
    sentiment: "negative_bcbs",
    patientStory: true,
    blameDirection: "bcbs",
    reachEstimate: "high",
    notes: "MM actively directing patients to post on social using #KeepMichiganMedicine, tag MM, share video stories. Downloadable letters to HR depts and elected officials. Highly organized grassroots mobilization BCBS has no equivalent to.",
  },
  {
    id: 25,
    date: "2026-03-05",
    source: "Threads (BCBS coverage denial anecdote)",
    sourceType: "social",
    channel: "social",
    headline: "User: BCBS wouldn't cover my C. diff test — paid $250 out of pocket",
    frameAdoption: "mm",
    sentiment: "negative_bcbs",
    patientStory: true,
    blameDirection: "bcbs",
    reachEstimate: "low",
    notes: "Personal coverage denial story. Ties prior negative BCBS experience to current dispute. Reinforces 'BCBS doesn't care about patients' narrative.",
  },
  {
    id: 26,
    date: "2026-03-05",
    source: "Threads (BCBS strategy callout)",
    sourceType: "social",
    channel: "social",
    headline: "User: 'BCBS released this hoping patients would pressure MM to negotiate'",
    frameAdoption: "mm",
    sentiment: "negative_bcbs",
    patientStory: false,
    blameDirection: "bcbs",
    reachEstimate: "low",
    notes: "Sophisticated media literacy take. User identifies BCBS's patient notification as a PR pressure tactic, then says it backfired: 'I'm not leaving my doctors, but I will leave BCBS.' Signals BCBS strategy is producing opposite of intended effect.",
  },
  {
    id: 27,
    date: "2026-03-05",
    source: "Threads (Corewell/UHC comparison)",
    sourceType: "social",
    channel: "social",
    headline: "Users draw parallel to Corewell-UHC dispute, Trinity-Aetna dispute",
    frameAdoption: "balanced",
    sentiment: "negative_bcbs",
    patientStory: false,
    blameDirection: "bcbs",
    reachEstimate: "low",
    notes: "Pattern recognition: 'Corewell did the same with UHC effective beginning April.' 'This is what happened with Trinity & Aetna.' Frames insurer-provider disputes as systemic insurer problem, not MM-specific.",
  },
  {
    id: 28,
    date: "2026-03-05",
    source: "Threads (single-payer advocacy cluster)",
    sourceType: "social",
    channel: "social",
    headline: "Multiple users invoke single-payer as solution",
    frameAdoption: "balanced",
    sentiment: "negative_bcbs",
    patientStory: false,
    blameDirection: "bcbs",
    reachEstimate: "medium",
    notes: "'Single payer health needs to happen. NOW!' — this narrative strand blames the entire insurance model (not MM). Dangerous for BCBS: dispute becomes rallying point for systemic insurance criticism.",
  },
  {
    id: 29,
    date: "2026-03-05",
    source: "Threads (CEO pay / nonprofit criticism)",
    sourceType: "social",
    channel: "social",
    headline: "Users attack BCBS nonprofit status and executive compensation",
    frameAdoption: "mm",
    sentiment: "negative_bcbs",
    patientStory: false,
    blameDirection: "bcbs",
    reachEstimate: "low",
    notes: "'Look up what the BCBS CEO is paid - even though its deemed nonprofit. They could reallocate that money to paying the facilities that provide care.' Populist anti-insurer framing.",
  },
  {
    id: 30,
    date: "2026-03-05",
    source: "Threads (dismissive/optimistic take)",
    sourceType: "social",
    channel: "social",
    headline: "User: 'This will not come to pass. They are just negotiating rates.'",
    frameAdoption: "balanced",
    sentiment: "neutral",
    patientStory: false,
    blameDirection: "both",
    reachEstimate: "low",
    notes: "Industry-informed view. Notes state insurance regs require 90-day notices. 'The parties are still in negotiations and will come to an agreement.' Minority voice but informed.",
  },
  {
    id: 31,
    date: "2026-03-06",
    source: "Threads (Trinity Health user)",
    sourceType: "social",
    channel: "social",
    headline: "Non-MM user disappointed about losing UM as backup option",
    frameAdoption: "balanced",
    sentiment: "neutral",
    patientStory: false,
    blameDirection: "both",
    reachEstimate: "low",
    notes: "'I typically use Trinity Health docs but I'm disappointed that if I need to utilize UM, I'm out of luck.' Broader community impact beyond direct MM patients.",
  },
  {
    id: 32,
    date: "2026-03-06",
    source: "Threads (open enrollment frustration)",
    sourceType: "social",
    channel: "social",
    headline: "User: 'This wasn't negotiated before open enrollment started? Unbelievable.'",
    frameAdoption: "balanced",
    sentiment: "negative_bcbs",
    patientStory: false,
    blameDirection: "bcbs",
    reachEstimate: "low",
    notes: "Process criticism — patients locked into BCBS plans during open enrollment now learning they may lose MM access. Blame lands on insurer for timing.",
  },
  {
    id: 33,
    date: "2026-03-10",
    source: "News article comments (Michigan Advance)",
    sourceType: "social",
    channel: "social",
    headline: "Patient Kristin Formo quoted: 'I don't care about the details. Figure it out.'",
    frameAdoption: "mm",
    sentiment: "negative_bcbs",
    patientStory: true,
    blameDirection: "bcbs",
    reachEstimate: "medium",
    notes: "Chronic illness patient who called BCBS after receiving MM email. 'I finally found doctors who listen.' Then BCBS sent contradicting email. Patient frustrated at both but acted on MM's CTA, indicating MM won her trust. 'Your primary concern should be the patient.'",
  },
  {
    id: 34,
    date: "2026-03-05",
    source: "News article comments (ClickOnDetroit/WDIV)",
    sourceType: "social",
    channel: "social",
    headline: "Mother of disabled son: 'It could be life-threatening to many people'",
    frameAdoption: "mm",
    sentiment: "negative_bcbs",
    patientStory: true,
    blameDirection: "bcbs",
    reachEstimate: "high",
    notes: "Kelly Shuler's son is developmentally disabled, covered by BCBS, long-time MM patient. 'I hope they hear that their decision and their lack of coming to the table negotiating is going to be devastating and catastrophic.' Directly blames BCBS for not negotiating.",
  },
  {
    id: 35,
    date: "2026-03-12",
    source: "Live Insurance News (industry blog/social)",
    sourceType: "social",
    channel: "social",
    headline: "Insurance industry blog: 'Patients in the Crossfire'",
    frameAdoption: "balanced",
    sentiment: "neutral",
    patientStory: false,
    blameDirection: "both",
    reachEstimate: "low",
    notes: "Industry-facing coverage. Frames as 'he-said, she-said.' Notes BCBS has 70% market power. Relatively balanced but headline frames patients as victims of both sides.",
  },
  // === ADDITIONAL MEDIA ===
  {
    id: 15,
    date: "2026-03-04",
    source: "Bridge Michigan",
    sourceType: "news",
    channel: "media",
    headline: "Blue Cross, Michigan Medicine dispute leaves 300,000 patients in lurch",
    frameAdoption: "balanced",
    sentiment: "neutral",
    patientStory: false,
    blameDirection: "both",
    reachEstimate: "high",
    notes: "Most data-rich coverage. Notes BCBS $246M loss in 2025 (5yr trend) vs MM $234M operating income. Contextualizes within broader MI healthcare turmoil. Relatively balanced but BCBS financial weakness exposed.",
  },
  {
    id: 16,
    date: "2026-03-05",
    source: "CBS Detroit",
    sourceType: "tv",
    channel: "media",
    headline: "Michigan Medicine will drop thousands of BCBS members if deal isn't reached",
    frameAdoption: "balanced",
    sentiment: "neutral",
    patientStory: false,
    blameDirection: "both",
    reachEstimate: "high",
    notes: "Notes BCBSM has not made profit in 5 years. Gives BCBS affordability argument fair airing. Both claims presented.",
  },
  {
    id: 17,
    date: "2026-03-05",
    source: "Michigan Public (NPR)",
    sourceType: "radio",
    channel: "media",
    headline: "Blue Cross-insured patients could lose access to Michigan Medicine care",
    frameAdoption: "mm",
    sentiment: "negative_bcbs",
    patientStory: false,
    blameDirection: "bcbs",
    reachEstimate: "medium",
    notes: "Quotes MM COO on fair compensation. BCBS 'affordability' frame gets less space. Disclosure: UM holds Michigan Public's broadcast license.",
  },
  {
    id: 18,
    date: "2026-03-05",
    source: "ClickOnDetroit (WDIV)",
    sourceType: "tv",
    channel: "media",
    headline: "'Could be life-threatening' — negotiations could disrupt care for thousands",
    frameAdoption: "mm",
    sentiment: "negative_bcbs",
    patientStory: true,
    blameDirection: "bcbs",
    reachEstimate: "high",
    notes: "Devastating patient story: mother of developmentally disabled son says 'it could be life-threatening.' MM COO quoted on modest increases. Strongest emotional framing found.",
  },
  {
    id: 19,
    date: "2026-03-05",
    source: "DBusiness Magazine",
    sourceType: "news",
    channel: "media",
    headline: "Michigan Medicine Threatens to Block BCBS Customers Starting July 1",
    frameAdoption: "bcbs",
    sentiment: "negative_mm",
    patientStory: false,
    blameDirection: "mm",
    reachEstimate: "low",
    notes: "Headline frames MM as aggressor ('threatens to block'). Leads with BCBS's 44% claim. BCBS comms VP: 'Causing people to worry is no way to win an argument over money.' Rare BCBS-favorable framing.",
  },
  {
    id: 20,
    date: "2026-03-07",
    source: "Detroit Free Press (via Yahoo/AOL syndication)",
    sourceType: "news",
    channel: "media",
    headline: "Blue Cross, Michigan Medicine contract fight: What patients should know",
    frameAdoption: "balanced",
    sentiment: "neutral",
    patientStory: true,
    blameDirection: "both",
    reachEstimate: "high",
    notes: "Comprehensive FAQ format. Notes analyst: '90% of these disputes end in agreement.' Students losing access to UHC services angle. Wide syndication (Yahoo, AOL, others).",
  },
  // === STAKEHOLDER ENTRIES ===
  {
    id: 21,
    date: "2026-03-19",
    source: "UM Board of Regents / Interim President Grasso",
    sourceType: "opinion",
    channel: "stakeholder",
    headline: "University president publicly accuses BCBS of lying",
    frameAdoption: "mm",
    sentiment: "negative_bcbs",
    patientStory: false,
    blameDirection: "bcbs",
    reachEstimate: "high",
    notes: "Major escalation: University's PRESIDENT weighs in at Board of Regents. 'Set the record straight.' Accuses BCBS of 'inaccuracies and untrue claims.' Institutional weight behind MM narrative.",
  },
  {
    id: 22,
    date: "2026-03-10",
    source: "MSMS (MI State Medical Society)",
    sourceType: "news",
    channel: "stakeholder",
    headline: "PIA Update on BCBSM and Michigan Medicine",
    frameAdoption: "balanced",
    sentiment: "neutral",
    patientStory: false,
    blameDirection: "both",
    reachEstimate: "low",
    notes: "Physician trade body monitoring. Factual update for member practices. Neutral but signals healthcare community engagement.",
  },
  {
    id: 23,
    date: "2026-03-10",
    source: "MI Dept of Insurance (DIFS)",
    sourceType: "news",
    channel: "stakeholder",
    headline: "DIFS declines to comment, says no authority over contract negotiations",
    frameAdoption: "balanced",
    sentiment: "neutral",
    patientStory: false,
    blameDirection: "both",
    reachEstimate: "medium",
    notes: "State regulator punts: 'We encourage both parties to return to the negotiating table.' No authority to intervene. Absence of government action favors status quo / MM position.",
  },
  {
    id: 24,
    date: "2026-03-07",
    source: "DMC / Tenet Healthcare",
    sourceType: "news",
    channel: "stakeholder",
    headline: "DMC says it's ready to absorb displaced Michigan Medicine patients",
    frameAdoption: "bcbs",
    sentiment: "neutral",
    patientStory: false,
    blameDirection: "both",
    reachEstimate: "low",
    notes: "Competitor signals capacity. Subtly undermines MM's 'irreplaceable' narrative, though experts question capacity for complex/specialty cases.",
  },
  {
    id: 36,
    date: "2026-02-28",
    source: "Corewell Health (via Crain's)",
    sourceType: "news",
    channel: "stakeholder",
    headline: "Corewell signs value-based contract with BCBS — sets precedent",
    frameAdoption: "bcbs",
    sentiment: "neutral",
    patientStory: false,
    blameDirection: "mm",
    reachEstimate: "high",
    notes: "CRITICAL: Corewell and HFH both signed value-based deals with BCBS. This is BCBS's strongest stakeholder card — MM is the only 'Big 3' holdout. BCBS framing: 'Why won't MM do what Corewell and HFH did?' Joint CEO announcement with BCBS CEO Keith.",
  },
  {
    id: 37,
    date: "2026-02-20",
    source: "Henry Ford Health (via Crain's)",
    sourceType: "news",
    channel: "stakeholder",
    headline: "Henry Ford Health signs value-based contract with BCBS",
    frameAdoption: "bcbs",
    sentiment: "neutral",
    patientStory: false,
    blameDirection: "mm",
    reachEstimate: "high",
    notes: "Second 'Big 3' system to sign. Joint announcement with BCBS CEO. MM now isolated as sole holdout among MI's three largest health systems. Combined, the three represent 61% of BCBS's $20.7B medical spend.",
  },
  {
    id: 38,
    date: "2026-03-02",
    source: "BCBS Financial Results (via Detroit News)",
    sourceType: "news",
    channel: "stakeholder",
    headline: "BCBS reports $246M loss in 2025 — 5th consecutive loss year",
    frameAdoption: "bcbs",
    sentiment: "positive_bcbs",
    patientStory: false,
    blameDirection: "mm",
    reachEstimate: "high",
    notes: "BCBS: $975M operating loss, 1,300 jobs cut, exec bonuses reduced. CEO Keith earned $6.9M (down from predecessor's $13.9M). Supports BCBS 'we're struggling too' narrative. BUT: CEO comp still a vulnerability on social.",
  },
  {
    id: 39,
    date: "2026-03-19",
    source: "UM Board of Regents / Interim President Grasso",
    sourceType: "opinion",
    channel: "stakeholder",
    headline: "University president publicly accuses BCBS of lying at Board meeting",
    frameAdoption: "mm",
    sentiment: "negative_bcbs",
    patientStory: false,
    blameDirection: "bcbs",
    reachEstimate: "high",
    notes: "Major escalation: University's PRESIDENT weighs in at formal Board of Regents meeting. 'Set the record straight.' 'BCBS shared inaccuracies and untrue claims.' Full institutional weight of UM behind MM.",
  },
  {
    id: 40,
    date: "2026-03-10",
    source: "MSMS (MI State Medical Society)",
    sourceType: "news",
    channel: "stakeholder",
    headline: "PIA Update on BCBSM and Michigan Medicine",
    frameAdoption: "balanced",
    sentiment: "neutral",
    patientStory: false,
    blameDirection: "both",
    reachEstimate: "low",
    notes: "Physician trade body monitoring. Factual PIA update for member practices. Neutral but signals healthcare community engagement.",
  },
  {
    id: 41,
    date: "2026-03-10",
    source: "MI Dept of Insurance (DIFS)",
    sourceType: "news",
    channel: "stakeholder",
    headline: "DIFS declines to comment, says no authority over contract negotiations",
    frameAdoption: "balanced",
    sentiment: "neutral",
    patientStory: false,
    blameDirection: "both",
    reachEstimate: "medium",
    notes: "State regulator punts: 'We encourage both parties to return to the negotiating table.' No authority to intervene. Absence of government action = no external pressure on either side.",
  },
  {
    id: 42,
    date: "2026-03-10",
    source: "MSU Healthcare Expert Greg Gulick",
    sourceType: "opinion",
    channel: "stakeholder",
    headline: "MSU professor: MM has 'extremely sympathetic case' despite BCBS market power",
    frameAdoption: "mm",
    sentiment: "negative_bcbs",
    patientStory: false,
    blameDirection: "bcbs",
    reachEstimate: "medium",
    notes: "Third-party academic expert. Notes BCBS holds ~70% market power. Says MM's unique role in complex/rare care gives it leverage. Widely quoted across Michigan Advance, Bridge, others.",
  },
  {
    id: 43,
    date: "2026-03-04",
    source: "Independent Analyst Allan Baumgarten",
    sourceType: "opinion",
    channel: "stakeholder",
    headline: "Healthcare analyst: '90% of these disputes end in agreement'",
    frameAdoption: "balanced",
    sentiment: "neutral",
    patientStory: false,
    blameDirection: "both",
    reachEstimate: "medium",
    notes: "Publishes annual MI Health Market Review. Provides historical context: Trinity/Aetna resolved at 11th hour. But also notes Corewell/UHC did NOT resolve. Tempering signal for both sides.",
  },
  {
    id: 44,
    date: "2026-03-23",
    source: "Michigan Daily (student newspaper)",
    sourceType: "news",
    channel: "stakeholder",
    headline: "Student newspaper covers impact on UM students with BCBS plans",
    frameAdoption: "balanced",
    sentiment: "neutral",
    patientStory: true,
    blameDirection: "both",
    reachEstimate: "medium",
    notes: "Students with commercial BCBS/BCN plans would lose access to UHC campus services. Student research assistant quoted on importance of on-campus access. New affected population beyond 300K figure.",
  },
  {
    id: 45,
    date: "2026-03-10",
    source: "BCBS CEO Tricia Keith (via Crain's interview)",
    sourceType: "opinion",
    channel: "stakeholder",
    headline: "BCBS CEO: 'This is not about our bottom line. This is about affordability.'",
    frameAdoption: "bcbs",
    sentiment: "positive_bcbs",
    patientStory: false,
    blameDirection: "mm",
    reachEstimate: "high",
    notes: "CEO interview. Points to MM $233M operating income and $2B expansion. Notes only 11% of BCBS payouts to MM are high-acuity. 'Common procedures cost 100% more than at peer hospitals.' Strongest data-driven BCBS argument.",
  },
  {
    id: 46,
    date: "2026-03-10",
    source: "MM CEO David Miller (via Crain's interview)",
    sourceType: "opinion",
    channel: "stakeholder",
    headline: "MM CEO: hospitals at 95% capacity — 'we need investment to drive care'",
    frameAdoption: "mm",
    sentiment: "negative_bcbs",
    patientStory: false,
    blameDirection: "bcbs",
    reachEstimate: "high",
    notes: "CEO interview. Ann Arbor hospitals at 95% capacity (85% is quality threshold). Justifies $2B expansion. 'We can't afford to not have life-saving services.' Counters BCBS 'wealthy system' narrative.",
  },
  {
    id: 47,
    date: "2026-03-05",
    source: "UM HR Department",
    sourceType: "news",
    channel: "stakeholder",
    headline: "UM HR reassures employees: your coverage is unaffected",
    frameAdoption: "balanced",
    sentiment: "neutral",
    patientStory: false,
    blameDirection: "both",
    reachEstimate: "medium",
    notes: "Institutional communication. UM employees/retirees retain in-network access regardless. But note: dependents on spouse's BCBS plan CANNOT be added to UM plan — creates family stress.",
  },
  {
    id: 48,
    date: "2026-03-10",
    source: "Healthcare policy expert Charles Gaba (via Michigan Advance)",
    sourceType: "opinion",
    channel: "stakeholder",
    headline: "Expert warns: if deal fails, 'a lot of people are not going to get that message'",
    frameAdoption: "balanced",
    sentiment: "neutral",
    patientStory: false,
    blameDirection: "both",
    reachEstimate: "low",
    notes: "Warns of communication failure in no-deal scenario. Patients will show up at MM not knowing they're out-of-network. Adds urgency narrative that implicitly pressures BCBS to settle.",
  },
  {
    id: 49,
    date: "2026-03-04",
    source: "Corewell/UHC parallel (Bridge Michigan context)",
    sourceType: "news",
    channel: "stakeholder",
    headline: "UnitedHealthcare already out-of-network for several Corewell facilities",
    frameAdoption: "balanced",
    sentiment: "neutral",
    patientStory: false,
    blameDirection: "both",
    reachEstimate: "medium",
    notes: "Context: insurer-provider breakdowns ARE happening in MI. Corewell/UHC dispute is live precedent that deals DON'T always resolve. Cuts against Baumgarten's 90% estimate. Raises stakes.",
  },
  {
    id: 50,
    date: "2026-03-02",
    source: "BCBS corporate comms (employer outreach)",
    sourceType: "owned",
    channel: "stakeholder",
    headline: "BCBS notifying 300K members AND their employers of MM's decision",
    frameAdoption: "bcbs",
    sentiment: "negative_mm",
    patientStory: false,
    blameDirection: "mm",
    reachEstimate: "high",
    notes: "BCBS's key strategic move: framing the notification as 'MM is locking you out' and cc'ing employers. Employer channel is where BCBS has strongest leverage (60% self-insured). Counter: MM also providing template letters for patients to send to HR/employers.",
  },
  {
    id: 51,
    date: "2026-03-05",
    source: "ClickOnDetroit (WDIV)",
    sourceType: "tv",
    channel: "media",
    headline: "Collin Shuler (developmentally disabled): mother Kelly says dispute 'could be life-threatening'",
    frameAdoption: "mm",
    sentiment: "negative_bcbs",
    patientStory: true,
    blameDirection: "bcbs",
    reachEstimate: "high",
    notes: "Kelly Shuler's son Collin is developmentally disabled, covered by BCBS, long-time MM patient. As he ages, medical needs increasing. Quote: 'I have enough stress. This just capitalizes on that. It's horrible.' 'Their decision and their lack of coming to the table negotiating is going to be devastating and catastrophic. It could be life-threatening to many people.' Directly blames BCBS for not negotiating. Andy Hetzel (BCBS VP Comms): 'Everybody is frustrated with the cost of their health insurance.' Luanne Thomas Ewald (MM COO): 'What we have proposed are really modest. Singular digit increases.'",
  },
  {
    id: 52,
    date: "2026-03-05",
    source: "WXYZ",
    sourceType: "tv",
    channel: "media",
    headline: "14-year-old Crohn's patient needs monthly infusions at Mott Children's Hospital — may lose access",
    frameAdoption: "mm",
    sentiment: "negative_bcbs",
    patientStory: true,
    blameDirection: "bcbs",
    reachEstimate: "high",
    notes: "Diagnosed with Crohn's at age 8, now 14. Receives monthly infusions at C.S. Mott Children's Hospital since diagnosis. Mother's quote about 'freaking out.' Children's hospital angle is extremely sympathetic — Mott is beloved in Michigan. If BCBS is seen as threatening access to a children's hospital, it's a PR disaster.",
  },
  {
    id: 53,
    date: "2026-03-02",
    source: "BCBSM (mibluedaily.com)",
    sourceType: "owned",
    channel: "media",
    headline: "BCBS notifies 300K members: 'Michigan Medicine's Decision to Lock Blue Cross Members Out Starting July 1'",
    frameAdoption: "bcbs",
    sentiment: "negative_mm",
    patientStory: false,
    blameDirection: "mm",
    reachEstimate: "high",
    notes: "BCBS's key PR move: framing the notification as 'MM is locking you out.' Language: 'Michigan Medicine is CHOOSING to remove its southeast Michigan facilities.' Frames MM as the aggressor. Also notifying employers — employer channel is where BCBS has strongest leverage (large self-insured accounts). Counter to MM's organized patient campaign.",
  },
  {
    id: 54,
    date: "2026-03-10",
    source: "Michigan Daily (student newspaper)",
    sourceType: "news",
    channel: "media",
    headline: "Student newspaper covers impact on UM students — Amina Ignatius: 'a lot more convenient to access on campus'",
    frameAdoption: "balanced",
    sentiment: "neutral",
    patientStory: true,
    blameDirection: "both",
    reachEstimate: "medium",
    notes: "LSA junior Amina Ignatius (neurophysiology research assistant) quoted. Students on Domestic/International Student Health Insurance Plans retain UHC campus clinic access but may lose access to other MM facilities. BCBS later announced it will cover UM students at campus clinics at in-network rates regardless — a tactical concession. Andy Hetzel: 'When their rationale is that we are unique and special, we recognize that, but we do not agree.' Mary Masson (MM): 'We treat the sickest of the sick.'",
  },
  {
    id: 55,
    date: "2026-03-10",
    source: "Ann Arbor Today (nationaltoday.com)",
    sourceType: "news",
    channel: "media",
    headline: "University of Michigan Students to Remain Covered by Blue Cross at Campus Clinics",
    frameAdoption: "bcbs",
    sentiment: "positive_bcbs",
    patientStory: false,
    blameDirection: "mm",
    reachEstimate: "medium",
    notes: "BCBS tactical win: announced students will retain campus clinic access at in-network rates even if contract ends. Protects BCBS from 'threatening student healthcare' narrative. Smart PR move — isolates the dispute to the broader 300K commercial population.",
  },
  {
    id: 56,
    date: "2026-02-27",
    source: "Henry Ford Health / BCBS (via Crain's Detroit)",
    sourceType: "news",
    channel: "stakeholder",
    headline: "Henry Ford Health signs value-based partnership with BCBS — second 'Big 3' deal",
    frameAdoption: "bcbs",
    sentiment: "neutral",
    patientStory: false,
    blameDirection: "mm",
    reachEstimate: "high",
    notes: "Henry Ford deal locks in value-based model through 2030+. Unified outcome metrics, shared pharma cost strategies. This is BCBS's second Big 3 deal (Corewell was first). MM is now the SOLE holdout among Michigan's three largest health systems. Combined, the three represent 61% of BCBS's $20.7B medical spend. BCBS's strongest 'why won't MM do what everyone else did' card.",
  },
  {
    id: 57,
    date: "2026-03-02",
    source: "BCBS Financial Results (via Crain's Detroit / Detroit News)",
    sourceType: "news",
    channel: "stakeholder",
    headline: "BCBSM reports $246M loss in 2025 — 5th consecutive loss year, CEO Keith earned $6.9M",
    frameAdoption: "bcbs",
    sentiment: "positive_bcbs",
    patientStory: false,
    blameDirection: "mm",
    reachEstimate: "high",
    notes: "Key data: $246M net loss on $43.3B revenue. $976M underwriting loss offset by $641M investment returns. 5th straight year paying more in claims than premiums. CEO Tricia Keith: $1.3M salary + $4.8M bonus + $814K other = $6.9M total. DOWN from predecessor Dan Loepp's $13.9M ($10.8M bonus). BCBS vulnerability: even reduced CEO pay ($6.9M) is still enormous for a nonprofit insurer and a target on social media.",
  },
  {
    id: 58,
    date: "2026-03-04",
    source: "Bridge Michigan",
    sourceType: "news",
    channel: "media",
    headline: "Bridge Michigan deep dive: BCBS $246M loss vs MM $234M operating income — financial asymmetry",
    frameAdoption: "balanced",
    sentiment: "neutral",
    patientStory: false,
    blameDirection: "both",
    reachEstimate: "high",
    notes: "Most data-rich coverage of the dispute. Key comparison: BCBS lost $246M in 2025 while MM earned $234M operating income. Contextualizes within broader MI healthcare turmoil (Corewell/UHC, Trinity/Aetna). Notes BCBS paid $2.6B MORE for medical/pharmacy in 2025 vs 2024. 'Big 3' framework: Corewell and HFH signed, MM sole holdout. BCBS financial weakness exposed but also lends credibility to affordability argument.",
  },
  {
    id: 59,
    date: "2026-03-05",
    source: "Threads (@michellewhisks)",
    sourceType: "social",
    channel: "social",
    headline: "Viral Threads post sharing BCBS member notification — high engagement, overwhelmingly anti-BCBS",
    frameAdoption: "mm",
    sentiment: "negative_bcbs",
    patientStory: false,
    blameDirection: "bcbs",
    reachEstimate: "high",
    notes: "@michellewhisks shared BCBS member notification text. BCBS framing ('Michigan Medicine is choosing to remove') backfired — comments overwhelmingly blame BCBS. Key data from comments: MM claims BCBS's most recent proposal cut payments by 30%. MM says hospitals in Michigan are 'chronically underpaid, receiving the third-lowest rates in the country' and that BCBS reimburses UM Health at rates '22% lower than those from all other major commercial insurance partners.' This viral post is the epicenter of social media conversation.",
  },
  {
    id: 60,
    date: "2026-03-05",
    source: "ABC12 Flint",
    sourceType: "tv",
    channel: "media",
    headline: "Michigan Medicine may leave Blue Cross Blue Shield network — Flint-area coverage",
    frameAdoption: "balanced",
    sentiment: "neutral",
    patientStory: false,
    blameDirection: "both",
    reachEstimate: "medium",
    notes: "Extends coverage beyond Ann Arbor/Detroit to Flint market. Demonstrates geographic breadth of the dispute's impact across southeast Michigan. Straight news reporting.",
  },
  {
    id: 61,
    date: "2026-03-12",
    source: "Live Insurance News",
    sourceType: "news",
    channel: "media",
    headline: "Patients in the Crossfire: Michigan Medicine and Blue Cross Blue Shield Contract Dispute",
    frameAdoption: "balanced",
    sentiment: "neutral",
    patientStory: false,
    blameDirection: "both",
    reachEstimate: "low",
    notes: "Insurance industry blog/trade. 'He-said, she-said' framing. Notes BCBS has ~70% market power in Michigan. Headline 'patients in the crossfire' frames both parties as responsible. Trade audience.",
  },
  {
    id: 62,
    date: "2026-03-05",
    source: "WOWO News/Talk (Indiana syndication)",
    sourceType: "radio",
    channel: "media",
    headline: "300,000 Patients Could Lose In-Network Access — story picked up by out-of-state outlets",
    frameAdoption: "balanced",
    sentiment: "neutral",
    patientStory: false,
    blameDirection: "both",
    reachEstimate: "low",
    notes: "Indiana outlet carrying MI story — signals geographic spread beyond Michigan. 300K figure is attention-getting even for audiences outside the dispute area.",
  },
  {
    id: 63,
    date: "2026-03-10",
    source: "InsuranceNewsNet (syndicated from MI Advance)",
    sourceType: "news",
    channel: "media",
    headline: "Michigan Advance story syndicated nationally via InsuranceNewsNet",
    frameAdoption: "balanced",
    sentiment: "neutral",
    patientStory: false,
    blameDirection: "both",
    reachEstimate: "medium",
    notes: "National insurance industry syndication of Michigan Advance's patient concerns story. Extends reach to insurance professionals nationally. Also syndicated to News From The States (national policy network).",
  },
  {
    id: 64,
    date: "2026-03-04",
    source: "Michigan Medicine (Facebook official)",
    sourceType: "social",
    channel: "social",
    headline: "Michigan Medicine Facebook post: 'resists significant cuts by BCBS that would limit patient access'",
    frameAdoption: "mm",
    sentiment: "negative_bcbs",
    patientStory: false,
    blameDirection: "bcbs",
    reachEstimate: "high",
    notes: "Official MM Facebook page post with high engagement. Framing: 'resists significant CUTS' — makes BCBS the aggressor cutting payments, not MM demanding increases. Effective counter to BCBS's 'MM is demanding 44%' narrative. Comments section overwhelmingly supportive of MM.",
  },
  {
    id: 65,
    date: "2026-03-23",
    source: "WEMU (NPR affiliate)",
    sourceType: "radio",
    channel: "media",
    headline: "WEMU: MM and BCBS 'still fighting' — UM interim president disputes BCBS claims",
    frameAdoption: "mm",
    sentiment: "negative_bcbs",
    patientStory: false,
    blameDirection: "bcbs",
    reachEstimate: "low",
    notes: "Latest coverage as of March 23. Stalemate continues. President Grasso's earlier accusations of BCBS 'inaccuracies and untrue claims' still driving narrative. NPR audience is influential/educated — shapes opinion-maker views.",
  },
  {
    id: 66,
    date: "2026-03-05",
    source: "Blue Water Healthy Living (syndicated from Free Press/Yahoo)",
    sourceType: "news",
    channel: "media",
    headline: "Blue Cross, Michigan Medicine contract fight: What patients should know — wide syndication",
    frameAdoption: "balanced",
    sentiment: "neutral",
    patientStory: true,
    blameDirection: "both",
    reachEstimate: "medium",
    notes: "Free Press FAQ story syndicated to Yahoo, AOL, Blue Water Healthy Living, and others. Widest-reach balanced coverage. Notes analyst estimate: '90% of these disputes end in agreement.' Student access angle. Comprehensive FAQ format serves patients but doesn't clearly blame either side.",
  },
  // === NEW ENTRIES: Web-Researched Round 2 ===
  {
    id: 68,
    date: "2026-03-10",
    source: "Crain's Detroit Business",
    sourceType: "news",
    channel: "media",
    headline: "Crain's deep dive: Tricia Keith 'This is about affordability' vs David Miller 'balance affordability with access'",
    frameAdoption: "balanced",
    sentiment: "neutral",
    patientStory: false,
    blameDirection: "both",
    reachEstimate: "high",
    notes: "Dustin Walsh. Keith (BCBSM CEO): 'This is about affordability for our members. They are a wealthy system getting bigger.' Miller (MM CEO): 'We need to find a balance where affordability doesn't come with limiting access. We take care of patients from all across the state, often from other systems.' Key data: MM inpatient 163% of Medicare (peers 206%), outpatient 212% of Medicare (peers 310%). Michigan hospital avg 189% of Medicare (3rd lowest nationally). MM operating at 95% capacity (recommended max 85%). 47,554 annual discharges, 312,436 patient days. 78% rate providers 4.9/5 stars. $2B recent expansion: $920M Kahn Pavilion, $800M Sparrow acquisition. 1,300 jobs eliminated at BCBSM in 2025.",
  },
  {
    id: 69,
    date: "2026-03-05",
    source: "Michigan Public (NPR)",
    sourceType: "news",
    channel: "media",
    headline: "Michigan Public: Blue Cross-insured patients unaffiliated with U-M could lose access",
    frameAdoption: "mm",
    sentiment: "negative_bcbs",
    patientStory: false,
    blameDirection: "bcbs",
    reachEstimate: "medium",
    notes: "Tracy Samilton report. Julie Ishak (Chief Nursing Executive, MM): 'Even with what Michigan Medicine is proposing, Blue Cross would still be paying well below other insurers in Michigan.' Andy Hetzel (BCBS): 'Blue Cross finds that to be unaffordable and potentially destabilizing.' Key angle: non-UM patients (community members with no UM affiliation who chose MM specialists) also lose access — broadens impact beyond campus community. Editor's note: UM holds Michigan Public's broadcast license.",
  },
  {
    id: 70,
    date: "2026-03-24",
    source: "Michigan Daily",
    sourceType: "news",
    channel: "media",
    headline: "Michigan Daily: Student impact — Amina Ignatius: 'a lot more convenient to access on campus'",
    frameAdoption: "mm",
    sentiment: "negative_bcbs",
    patientStory: true,
    blameDirection: "bcbs",
    reachEstimate: "medium",
    notes: "Kylie Harmala report. Most detailed student-focused coverage. Amina Ignatius (LSA junior, neurophysiological research asst): 'Student health care is important. If students get sick or have other long-term medical needs, it's a lot more convenient to access them on campus.' Mary Masson (MM PR): 'We treat the sickest of the sick. We're the state's only academic medical center.' Hetzel: 'It's really unfortunate for the patients caught in the middle.' 4.3M BCBSM members. Student insurance plans may face reduced specialty access at University Hospital, Mott, Frankel, Kahn. Campus health services unaffected.",
  },
  {
    id: 71,
    date: "2026-03-19",
    source: "Detroit News",
    sourceType: "news",
    channel: "media",
    headline: "Detroit News: UM Interim President Grasso disputes Blue Cross claims at Board of Regents",
    frameAdoption: "mm",
    sentiment: "negative_bcbs",
    patientStory: false,
    blameDirection: "bcbs",
    reachEstimate: "high",
    notes: "Sarah Atwood report. Grasso at Regents meeting: wanted to 'set the record straight.' Claims BCBS shared 'inaccuracies and untrue claims' causing patient fear. MM seeks contract continuation with payments based on 'clear and quantifiable performance outcomes.' 'These are patients who not only want to come here for their care, but in many cases, cannot get that care they need elsewhere.' Hetzel response: MM initiated termination March 2, 'locking out members starting July 1.' BCBS 'cannot accept 44 percent increase.' Significantly escalates rhetoric — university president directly accusing insurer of lying.",
  },
  {
    id: 72,
    date: "2026-03-06",
    source: "CBS Detroit",
    sourceType: "tv",
    channel: "media",
    headline: "CBS Detroit: Michigan Medicine will drop thousands of BCBS members if deal isn't reached",
    frameAdoption: "balanced",
    sentiment: "neutral",
    patientStory: false,
    blameDirection: "both",
    reachEstimate: "high",
    notes: "Paula Wethington. 120-day notice given March 2. 12 hospitals and hundreds of clinics. BCBS: 'Medical and drug costs have grown faster than we have been able to price our health insurance plans. No profit in five years.' Dr. David Miller: maintaining 'high-quality, specialized care patients depend on.' Commercial/private pay AFFECTED; Medicare Advantage, Medicaid, UM Health Plan NOT affected. Key TV audience in Detroit metro — BCBS HQ market.",
  },
  {
    id: 73,
    date: "2026-03-12",
    source: "WXYZ Detroit",
    sourceType: "tv",
    channel: "media",
    headline: "WXYZ: Families worried — Julie Graber's pregnant daughter, Haley Murphy's baby with rare genetic disorder",
    frameAdoption: "mm",
    sentiment: "negative_bcbs",
    patientStory: true,
    blameDirection: "bcbs",
    reachEstimate: "high",
    notes: "Patient stories not in earlier coverage. Julie Graber: daughter pregnant, seeing OB-GYN at Michigan Medicine, due in July — exactly when contract would expire. Haley Murphy: 9-month-old daughter has rare genetic disorder preventing protein processing, sees MM doctor every 3 months. Kristin Formo: chronic illness patient who found MM doctors who 'listen with empathy.' Three distinct patient stories in single segment — most patient-focused local TV coverage of BCBSM dispute.",
  },
  {
    id: 75,
    date: "2026-01-01",
    source: "Trinity Health / Humana",
    sourceType: "other",
    channel: "stakeholder",
    headline: "Trinity Health (9 MI hospitals) stopped accepting Humana Medicare Advantage plans — 28K patients affected",
    frameAdoption: "balanced",
    sentiment: "neutral",
    patientStory: false,
    blameDirection: "both",
    reachEstimate: "medium",
    notes: "From Crain's June 2025 investigation. Trinity Health's 9 Michigan hospitals (serving ~800K patients) dropped Humana Medicare Advantage Jan 1 — impacting ~28K patients. Unresolved months later. Parallel dispute showing it's not just BCBS facing pushback — multiple payers vs multiple systems simultaneously. Michigan healthcare market under systemic stress. Consolidation on both sides driving harder negotiations.",
  },
  {
    id: 76,
    date: "2026-02-27",
    source: "Henry Ford Health / BCBSM (joint announcement)",
    sourceType: "other",
    channel: "stakeholder",
    headline: "Henry Ford Health signs value-based partnership with BCBS — second 'Big 3' system to agree",
    frameAdoption: "bcbs",
    sentiment: "positive_bcbs",
    patientStory: false,
    blameDirection: "mm",
    reachEstimate: "high",
    notes: "Henry Ford ($9.6B system, 550 locations, acquired 8 Ascension hospitals) signs value-based deal with BCBS. Follows Corewell deal. Both agreed to quality and accountability framework. BCBS can now say: 'Two out of three major systems accepted our terms. Michigan Medicine is the outlier.' Undermines MM's claim that BCBS is unreasonable — but MM counters that HFH/Corewell operate at different scale/complexity and aren't sole academic medical center.",
  },
  {
    id: 77,
    date: "2026-02-15",
    source: "Crain's Grand Rapids / Corewell Health",
    sourceType: "news",
    channel: "media",
    headline: "Crain's GR: Corewell and BCBS 'begin a new era of partnership' — locked through 2030",
    frameAdoption: "bcbs",
    sentiment: "positive_bcbs",
    patientStory: false,
    blameDirection: "mm",
    reachEstimate: "medium",
    notes: "Corewell Health ($16.4B system, 22 hospitals, formed from 2022 Spectrum/Beaumont merger) signs multi-year deal through 2030. Value-based reimbursement emphasizing quality. Both Corewell and HFH deals create pressure on MM — the 'Big 3' are now 2-vs-1 in favor of BCBS's framework. MM is increasingly isolated in its hardline position, though it argues as the state's only academic medical center, its complexity justifies different terms.",
  },
  {
    id: 78,
    date: "2026-03-19",
    source: "MSMS (Michigan State Medical Society)",
    sourceType: "other",
    channel: "stakeholder",
    headline: "MSMS PIA Update: Medical society monitoring situation, offering alternative carrier assistance",
    frameAdoption: "balanced",
    sentiment: "neutral",
    patientStory: false,
    blameDirection: "both",
    reachEstimate: "low",
    notes: "MSMS (state medical society representing physicians) issues PIA Update March 19. Confirms July 1 exit if no deal. Lists affected facilities and continuity of care conditions (cancer, terminal illness, cardiovascular, diabetes, autoimmune, Alzheimer's, transplant, pregnancy). 90-day in-network extension for qualifying conditions. Angela Criswell (Director of Operations/Sales) contact for alternative carrier proposals. Notable: MSMS takes NO side — 'will continue to monitor.' Physician society neutrality notable given other states where medical societies have aligned with hospitals.",
  },
  {
    id: 79,
    date: "2026-03-02",
    source: "BCBSM (mibluedaily.com)",
    sourceType: "owned",
    channel: "media",
    headline: "BCBS: 'Michigan Medicine's Decision to Lock Blue Cross Members Out Starting July 1'",
    frameAdoption: "bcbs",
    sentiment: "negative_mm",
    patientStory: false,
    blameDirection: "mm",
    reachEstimate: "medium",
    notes: "Aggressive BCBS framing: 'lock out.' Language positions MM as actively denying care rather than negotiating. Targets 300K members AND their employers with direct notification. Strategic: by alerting employers, BCBS creates pressure from the employer side — HR departments questioning whether to keep plans with disrupted networks. Counter-move to MM's patient mobilization campaign. 60% of BCBS members are self-insured employer plans — employer perception matters enormously.",
  },
];

const LABELS = {
  frameAdoption: { mm: "MM Frame", bcbs: "BCBS Frame", balanced: "Balanced" },
  sentiment: {
    negative_bcbs: "Anti-BCBS",
    negative_mm: "Anti-MM",
    neutral: "Neutral",
    positive_bcbs: "Pro-BCBS",
    positive_mm: "Pro-MM",
  },
  blameDirection: { bcbs: "Blames BCBS", mm: "Blames MM", both: "Both/Neither" },
  reachEstimate: { high: "High", medium: "Medium", low: "Low" },
  sourceType: { news: "Print/Online News", tv: "TV", radio: "Radio", owned: "Owned Media", social: "Social/Forum", opinion: "Op-Ed/Editorial" },
  channel: { media: "Media", social: "Social/Forum", stakeholder: "Stakeholder" },
};

const COLORS = {
  mm: "#00274C",
  bcbs: "#2F65A7",
  neutral: "#465E85",
  negative_bcbs: "#9A3324",
  negative_mm: "#2F65A7",
  positive_bcbs: "#2F65A7",
  positive_mm: "#9A3324",
  accent: "#FFCB05",
  bg: "#00274C",
  surface: "#002D5A",
  surfaceHover: "#003A72",
  border: "#1A4A7A",
  text: "#F2E6C9",
  textMuted: "#8FAAC4",
  red: "#9A3324",
  green: "#00B2A9",
  amber: "#FFCB05",
};

// Source credibility weights — credibility-adjusted influence on composite score
// Tier 1 (1.5x): National record — shapes the frame for everyone else
// Tier 2 (1.2x): Regional authority — trusted by the affected population
// Tier 3 (1.0x): Trade/niche — credible but narrower audiences
// Tier 4 (0.7x): Organic social — authentic sentiment signal, unvetted
// Tier 5 (0.4x): Comment sections — lowest-effort engagement, selection bias
// Tier 6 (0.3x): Owned/party media — propaganda, tracks effort not credibility
// Tier 7 (1.3x): Stakeholder actions — actions > words
const SOURCE_WEIGHTS = {
  // Tier 1 — National record (1.5)
  "KFF Health News": 1.5, "NPR": 1.5,
  // Tier 2 — Regional authority (1.2)
  "Detroit News": 1.2, "Bridge Michigan": 1.2, "Crain's Detroit Business": 1.2,
  "Crain's Grand Rapids / Corewell Health": 1.2,
  "WXYZ": 1.2, "WXYZ Detroit": 1.2, "CBS Detroit": 1.2,
  "WNEM / WILX": 1.2, "Michigan Public (NPR)": 1.2, "WEMU": 1.2,
  "WEMU (NPR affiliate)": 1.2, "Detroit Free Press (via Yahoo/AOL syndication)": 1.2,
  "ABC12 Flint": 1.2,
  // Tier 3 — Trade/niche (1.0)
  "Michigan Advance": 1.0, "Michigan Daily (student newspaper)": 1.0, "Michigan Daily": 1.0,
  "DBusiness Magazine": 1.0, "ClickOnDetroit (WDIV)": 1.0,
  "Live Insurance News": 1.0, "Live Insurance News (industry blog/social)": 1.0,
  "InsuranceNewsNet (syndicated from MI Advance)": 1.0,
  "WOWO News/Talk (Indiana syndication)": 1.0,
  "Ann Arbor Today (nationaltoday.com)": 1.0,
  "Blue Water Healthy Living (syndicated from Free Press/Yahoo)": 1.0,
  // Tier 4 — Organic social (0.7)
  "Threads (@michellewhisks)": 0.7, "Threads (various replies)": 0.7,
  "Threads (dissenting view)": 0.7, "Threads (patient panicking)": 0.7,
  "Threads (BCBS coverage denial anecdote)": 0.7, "Threads (BCBS strategy callout)": 0.7,
  "Threads (Corewell/UHC comparison)": 0.7, "Threads (single-payer advocacy cluster)": 0.7,
  "Threads (CEO pay / nonprofit criticism)": 0.7, "Threads (dismissive/optimistic take)": 0.7,
  "Threads (Trinity Health user)": 0.7, "Threads (open enrollment frustration)": 0.7,
  "Reddit r/AnnArbor (referenced in Threads)": 0.7,
  "Social media (MM #KeepMichiganMedicine campaign)": 0.7,
  // Tier 5 — Comment sections (0.4)
  "News article comments (Michigan Advance)": 0.4,
  "News article comments (ClickOnDetroit/WDIV)": 0.4,
  // Tier 6 — Owned/party media (0.3)
  "BCBSM (mibluedaily.com)": 0.3, "Michigan Medicine (Facebook official)": 0.3,
  "BCBS Financial Results (via Detroit News)": 0.3,
  "BCBS Financial Results (via Crain's Detroit / Detroit News)": 0.3,
  "BCBS corporate comms (employer outreach)": 0.3, "BCBS CEO Tricia Keith (via Crain's interview)": 0.3,
  "MM CEO David Miller (via Crain's interview)": 0.3, "UM HR Department": 0.3,
  // Tier 7 — Stakeholder actions (1.3)
  "UM Board of Regents / Interim President Grasso": 1.3,
  "MSMS (MI State Medical Society)": 1.3, "MSMS (Michigan State Medical Society)": 1.3,
  "MI Dept of Insurance (DIFS)": 1.3, "DMC / Tenet Healthcare": 1.3,
  "Corewell Health (via Crain's)": 1.3, "Henry Ford Health (via Crain's)": 1.3,
  "Henry Ford Health / BCBS (via Crain's Detroit)": 1.3,
  "Henry Ford Health / BCBSM (joint announcement)": 1.3,
  "Corewell/UHC parallel (Bridge Michigan context)": 1.3,
  "MSU Healthcare Expert Greg Gulick": 1.3, "Independent Analyst Allan Baumgarten": 1.3,
  "Healthcare policy expert Charles Gaba (via Michigan Advance)": 1.3,
  "Trinity Health / Humana": 1.3,
};
const SOURCE_TYPE_WEIGHTS = { tv: 1.2, radio: 1.2, news: 1.0, social: 0.7, owned: 0.3, opinion: 0.8, other: 1.0 };
function getWeight(entry) {
  return SOURCE_WEIGHTS[entry.source] ?? SOURCE_TYPE_WEIGHTS[entry.sourceType] ?? 1.0;
}

function computeScores(entries) {
  const totalW = entries.reduce((s, e) => s + getWeight(e), 0) || 1;
  const mediaEntries = entries.filter((e) => e.channel === "media");
  const socialEntries = entries.filter((e) => e.channel === "social");
  const stakeholderEntries = entries.filter((e) => e.channel === "stakeholder");

  const frameMM = entries.filter((e) => e.frameAdoption === "mm").reduce((s, e) => s + getWeight(e), 0);
  const frameBCBS = entries.filter((e) => e.frameAdoption === "bcbs").reduce((s, e) => s + getWeight(e), 0);
  const frameScore = ((frameMM - frameBCBS) / totalW) * 100;

  const sentNegBCBS = entries.filter((e) => e.sentiment === "negative_bcbs" || e.sentiment === "positive_mm").reduce((s, e) => s + getWeight(e), 0);
  const sentNegMM = entries.filter((e) => e.sentiment === "negative_mm" || e.sentiment === "positive_bcbs").reduce((s, e) => s + getWeight(e), 0);
  const sentScore = ((sentNegBCBS - sentNegMM) / totalW) * 100;

  const blameBCBS = entries.filter((e) => e.blameDirection === "bcbs").reduce((s, e) => s + getWeight(e), 0);
  const blameMM = entries.filter((e) => e.blameDirection === "mm").reduce((s, e) => s + getWeight(e), 0);
  const blameScore = ((blameBCBS - blameMM) / totalW) * 100;

  const patientW = entries.filter((e) => e.patientStory).reduce((s, e) => s + getWeight(e), 0);
  const patientScore = (patientW / totalW) * 100;

  const composite = frameScore * 0.3 + sentScore * 0.3 + blameScore * 0.25 + patientScore * 0.15;

  return {
    total: entries.length,
    totalWeighted: totalW,
    mediaCount: mediaEntries.length,
    socialCount: socialEntries.length,
    stakeholderCount: stakeholderEntries.length,
    frameScore,
    sentScore,
    blameScore,
    patientScore,
    composite,
    frameMM: entries.filter((e) => e.frameAdoption === "mm").length,
    frameBCBS: entries.filter((e) => e.frameAdoption === "bcbs").length,
    frameBalanced: entries.filter((e) => e.frameAdoption === "balanced").length,
    sentNegBCBS: entries.filter((e) => e.sentiment === "negative_bcbs" || e.sentiment === "positive_mm").length,
    sentNegMM: entries.filter((e) => e.sentiment === "negative_mm" || e.sentiment === "positive_bcbs").length,
    sentNeutral: entries.filter((e) => e.sentiment === "neutral").length,
    blameBCBS: entries.filter((e) => e.blameDirection === "bcbs").length,
    blameMM: entries.filter((e) => e.blameDirection === "mm").length,
    blameBoth: entries.filter((e) => e.blameDirection === "both").length,
    patientStories: entries.filter((e) => e.patientStory).length,
  };
}

function computeTrend(entries) {
  if (entries.length === 0) return [];
  const sorted = [...entries].sort((a, b) => a.date.localeCompare(b.date));
  const dateMap = {};
  sorted.forEach((e) => {
    if (!dateMap[e.date]) dateMap[e.date] = [];
    dateMap[e.date].push(e);
  });
  const dates = Object.keys(dateMap).sort();
  const points = [];
  const cumulative = [];
  dates.forEach((d) => {
    cumulative.push(...dateMap[d]);
    const s = computeScores(cumulative);
    points.push({ date: d, composite: s.composite, count: cumulative.length, dateCount: dateMap[d].length, frame: s.frameScore, sent: s.sentScore, blame: s.blameScore });
  });
  return points;
}

const MONITOR_START = "2026-01-01";
const DISPUTE_PUBLIC_DATE = "2026-03-03";

function TrendChart({ entries, filterChannel }) {
  const allTrend = useMemo(() => computeTrend(entries), [entries]);
  const channelTrend = useMemo(() => {
    if (filterChannel === "all") return null;
    const channelEntries = entries.filter((e) => e.channel === filterChannel);
    if (channelEntries.length < 2) return null;
    return computeTrend(channelEntries);
  }, [entries, filterChannel]);

  if (allTrend.length < 2) return null;

  const W = 680, H = 160, PX = 50, PY = 24;
  const plotW = W - PX * 2, plotH = H - PY * 2;

  const allVals = allTrend.map((t) => t.composite);
  const chVals = channelTrend ? channelTrend.map((t) => t.composite) : [];
  const combined = [...allVals, ...chVals];
  const maxAbs = Math.max(Math.abs(Math.min(...combined)), Math.abs(Math.max(...combined)), 30);
  const yMin = -maxAbs, yMax = maxAbs;

  const allDates = allTrend.map((t) => t.date);
  const x = (i) => PX + (i / (allDates.length - 1)) * plotW;
  const xByDate = (dateStr) => {
    for (let i = 0; i < allDates.length - 1; i++) {
      if (dateStr >= allDates[i] && dateStr <= allDates[i + 1]) {
        const d0 = new Date(allDates[i]).getTime();
        const d1 = new Date(allDates[i + 1]).getTime();
        const dt = new Date(dateStr).getTime();
        const frac = d1 === d0 ? 0 : (dt - d0) / (d1 - d0);
        return x(i + frac);
      }
    }
    if (dateStr < allDates[0]) return x(0);
    return x(allDates.length - 1);
  };
  const y = (v) => PY + ((yMax - v) / (yMax - yMin)) * plotH;
  const zeroY = y(0);

  // Build aggregate line
  const aggLinePoints = allTrend.map((t, i) => `${x(i)},${y(t.composite)}`).join(" ");

  // Build area paths for aggregate
  const areaAbove = [];
  const areaBelow = [];
  allTrend.forEach((t, i) => {
    const px = x(i), py = y(t.composite);
    if (t.composite >= 0) {
      areaAbove.push(`${px},${py}`);
      areaBelow.push(`${px},${zeroY}`);
    } else {
      areaAbove.push(`${px},${zeroY}`);
      areaBelow.push(`${px},${py}`);
    }
  });
  const areaAbovePath = `M${PX},${zeroY} L${areaAbove.join(" L")} L${x(allTrend.length - 1)},${zeroY} Z`;
  const areaBelowPath = `M${PX},${zeroY} L${areaBelow.join(" L")} L${x(allTrend.length - 1)},${zeroY} Z`;

  // Build channel overlay line — map channel dates onto the allDates x-axis
  let chLinePoints = "";
  let chDots = [];
  const chColorMap = { media: "#2F65A7", social: "#00B2A9", stakeholder: "#D86018" };
  const chColor = chColorMap[filterChannel] || COLORS.amber;
  const chLabelMap = { media: "MEDIA", social: "SOCIAL", stakeholder: "STAKEHOLDER" };

  if (channelTrend) {
    const mappedPoints = channelTrend.map((ct) => {
      return { x: xByDate(ct.date), y: y(ct.composite), composite: ct.composite, count: ct.count, date: ct.date };
    });
    chLinePoints = mappedPoints.map((p) => `${p.x},${p.y}`).join(" ");
    chDots = mappedPoints;
  }

  const gridLines = [-20, 0, 20];
  const fmtDate = (d) => { const parts = d.split("-"); return `${parseInt(parts[1])}/${parseInt(parts[2])}`; };
  const isOverlay = filterChannel !== "all" && channelTrend;
  const disputeX = xByDate(DISPUTE_PUBLIC_DATE);

  // Volume bars: when filtered, show only that channel's per-date volume; otherwise show all
  const volumeData = useMemo(() => {
    const source = filterChannel !== "all" ? entries.filter((e) => e.channel === filterChannel) : entries;
    const sorted = [...source].sort((a, b) => a.date.localeCompare(b.date));
    const dMap = {};
    sorted.forEach((e) => { dMap[e.date] = (dMap[e.date] || 0) + 1; });
    return allTrend.map((t) => ({ date: t.date, vol: dMap[t.date] || 0 }));
  }, [entries, filterChannel, allTrend]);
  const maxVol = Math.max(...volumeData.map((v) => v.vol), 1);
  const barMaxH = plotH * 0.55;
  const barW = Math.max(4, Math.min(18, plotW / allTrend.length * 0.6));

  return (
    <div style={{ marginTop: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        <div style={{ fontSize: 10, letterSpacing: 1.5, color: COLORS.textMuted, fontFamily: "'JetBrains Mono', monospace" }}>
          NARRATIVE MOMENTUM — CUMULATIVE COMPOSITE OVER TIME
        </div>
        {isOverlay && (
          <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 9, fontFamily: "'JetBrains Mono', monospace" }}>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ width: 16, height: 2, background: COLORS.amber, display: "inline-block", borderRadius: 1 }} />
              <span style={{ color: COLORS.textMuted }}>ALL</span>
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ width: 16, height: 3, background: chColor, display: "inline-block", borderRadius: 1 }} />
              <span style={{ color: chColor, fontWeight: 700 }}>{chLabelMap[filterChannel]}</span>
            </span>
          </div>
        )}
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto" }}>
        {/* Volume bars — behind everything */}
        {volumeData.map((v, i) => {
          if (v.vol === 0) return null;
          const barH = (v.vol / maxVol) * barMaxH;
          const bx = x(i) - barW / 2;
          const by = H - PY - barH;
          return (
            <rect key={`vol${i}`} x={bx} y={by} width={barW} height={barH} rx={2} fill="rgba(255,255,255,0.06)" />
          );
        })}
        {/* Grid */}
        {gridLines.map((v) => (
          <g key={v}>
            <line x1={PX} y1={y(v)} x2={W - PX} y2={y(v)} stroke={v === 0 ? COLORS.textMuted : COLORS.border} strokeWidth={v === 0 ? 1 : 0.5} strokeDasharray={v === 0 ? "" : "4,4"} opacity={v === 0 ? 0.6 : 0.4} />
            <text x={PX - 6} y={y(v) + 3.5} textAnchor="end" fill={COLORS.textMuted} fontSize="9" fontFamily="'JetBrains Mono', monospace">
              {v > 0 ? "+" : ""}{v}
            </text>
          </g>
        ))}
        {/* Axis labels */}
        <text x={PX - 6} y={PY - 8} textAnchor="end" fill={COLORS.red} fontSize="8" fontFamily="'JetBrains Mono', monospace">MM</text>
        <text x={PX - 6} y={H - PY + 14} textAnchor="end" fill="#2F65A7" fontSize="8" fontFamily="'JetBrains Mono', monospace">BCBS</text>
        {/* Date labels */}
        {allTrend.map((t, i) => (
          (i === 0 || i === allTrend.length - 1 || (allTrend.length > 5 && i === Math.floor(allTrend.length / 2))) ? (
            <text key={i} x={x(i)} y={H - 2} textAnchor="middle" fill={COLORS.textMuted} fontSize="8" fontFamily="'JetBrains Mono', monospace">
              {fmtDate(t.date)}
            </text>
          ) : null
        ))}
        {/* Dispute goes public marker */}
        <line x1={disputeX} y1={PY} x2={disputeX} y2={H - PY} stroke="#D86018" strokeWidth={1.5} strokeDasharray="4,3" opacity={0.7} />
        <text x={disputeX + 4} y={PY + 4} fill="#D86018" fontSize="7" fontFamily="'JetBrains Mono', monospace" fontWeight="700" opacity={0.8}>
          DISPUTE PUBLIC
        </text>
        <text x={disputeX + 4} y={PY + 12} fill="#D86018" fontSize="7" fontFamily="'JetBrains Mono', monospace" opacity={0.6}>
          {fmtDate(DISPUTE_PUBLIC_DATE)}
        </text>
        {/* Area fills — always aggregate */}
        <path d={areaAbovePath} fill={COLORS.red} opacity={isOverlay ? 0.06 : 0.12} />
        <path d={areaBelowPath} fill="#2F65A7" opacity={isOverlay ? 0.06 : 0.12} />
        {/* Aggregate line — always visible */}
        <polyline points={aggLinePoints} fill="none" stroke={COLORS.amber} strokeWidth={isOverlay ? 1.5 : 2.5} strokeLinejoin="round" strokeLinecap="round" opacity={isOverlay ? 0.4 : 1} />
        {/* Aggregate dots — dimmed when overlay active */}
        {allTrend.map((t, i) => {
          const dotColor = t.composite > 10 ? COLORS.red : t.composite < -10 ? "#2F65A7" : COLORS.amber;
          return (
            <g key={i} opacity={isOverlay ? 0.3 : 1}>
              <circle cx={x(i)} cy={y(t.composite)} r={isOverlay ? 3 : 4} fill={COLORS.bg} stroke={dotColor} strokeWidth={2} />
              {!isOverlay && (
                <>
                  <text x={x(i)} y={y(t.composite) - 8} textAnchor="middle" fill={dotColor} fontSize="8" fontWeight="700" fontFamily="'JetBrains Mono', monospace">
                    {t.composite > 0 ? "+" : ""}{t.composite.toFixed(0)}
                  </text>
                  <text x={x(i)} y={y(t.composite) + 12} textAnchor="middle" fill={COLORS.textMuted} fontSize="7" fontFamily="'JetBrains Mono', monospace" opacity={0.6}>
                    n={t.count}
                  </text>
                </>
              )}
            </g>
          );
        })}
        {/* Channel overlay line */}
        {isOverlay && chLinePoints && (
          <polyline points={chLinePoints} fill="none" stroke={chColor} strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />
        )}
        {/* Channel overlay dots */}
        {isOverlay && chDots.map((p, i) => {
          const dc = p.composite > 10 ? COLORS.red : p.composite < -10 ? "#2F65A7" : chColor;
          return (
            <g key={`ch${i}`}>
              <circle cx={p.x} cy={p.y} r={5} fill={COLORS.bg} stroke={chColor} strokeWidth={2.5} />
              <text x={p.x} y={p.y - 10} textAnchor="middle" fill={chColor} fontSize="9" fontWeight="700" fontFamily="'JetBrains Mono', monospace">
                {p.composite > 0 ? "+" : ""}{p.composite.toFixed(0)}
              </text>
              <text x={p.x} y={p.y + 14} textAnchor="middle" fill={COLORS.textMuted} fontSize="7" fontFamily="'JetBrains Mono', monospace" opacity={0.7}>
                n={p.count}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function ExecutiveSummary({ entries, filterChannel, scores }) {
  const channelScores = useMemo(() => {
    const ch = {};
    ["media", "social", "stakeholder"].forEach((c) => {
      const ce = entries.filter((e) => e.channel === c);
      ch[c] = ce.length >= 2 ? computeScores(ce) : null;
    });
    return ch;
  }, [entries]);

  const momentum = useMemo(() => {
    const sorted = [...entries].sort((a, b) => a.date.localeCompare(b.date));
    const mid = Math.floor(sorted.length / 2);
    if (mid < 3) return null;
    const early = computeScores(sorted.slice(0, mid));
    const late = computeScores(sorted.slice(mid));
    return { early: early.composite, late: late.composite, shift: late.composite - early.composite };
  }, [entries]);

  const topPatientStories = useMemo(() => {
    return entries
      .filter((e) => e.patientStory && getWeight(e) >= 1.0)
      .sort((a, b) => getWeight(b) - getWeight(a))
      .slice(0, 3);
  }, [entries]);

  // Trend drivers — what is causing momentum shifts and why
  const trendDrivers = useMemo(() => {
    const sorted = [...entries].sort((a, b) => a.date.localeCompare(b.date));
    const mid = Math.floor(sorted.length / 2);
    if (mid < 3) return null;
    const early = sorted.slice(0, mid);
    const late = sorted.slice(mid);
    const earlyScores = computeScores(early);
    const lateScores = computeScores(late);

    const dims = [
      { name: "Frame Adoption", key: "frameScore", weight: "30%", early: earlyScores.frameScore, late: lateScores.frameScore },
      { name: "Sentiment", key: "sentScore", weight: "30%", early: earlyScores.sentScore, late: lateScores.sentScore },
      { name: "Blame Direction", key: "blameScore", weight: "25%", early: earlyScores.blameScore, late: lateScores.blameScore },
      { name: "Patient Stories", key: "patientScore", weight: "15%", early: earlyScores.patientScore, late: lateScores.patientScore },
    ];
    const dimShifts = dims
      .map((d) => ({ ...d, shift: d.late - d.early }))
      .filter((d) => Math.abs(d.shift) > 3)
      .sort((a, b) => Math.abs(b.shift) - Math.abs(a.shift));

    const channelMomentum = [];
    ["media", "social", "stakeholder"].forEach((ch) => {
      const chEarly = early.filter((e) => e.channel === ch);
      const chLate = late.filter((e) => e.channel === ch);
      if (chEarly.length < 2 || chLate.length < 2) return;
      const eScores = computeScores(chEarly);
      const lScores = computeScores(chLate);
      const shift = lScores.composite - eScores.composite;
      if (Math.abs(shift) > 5) {
        const label = ch.charAt(0).toUpperCase() + ch.slice(1);
        const drivers = [];
        const frameDiff = lScores.frameScore - eScores.frameScore;
        const sentDiff = lScores.sentScore - eScores.sentScore;
        const blameDiff = lScores.blameScore - eScores.blameScore;
        const patDiff = lScores.patientScore - eScores.patientScore;
        if (Math.abs(frameDiff) > 5) drivers.push(`frame adoption ${frameDiff > 0 ? "shifting toward MM" : "shifting toward BCBS"} (${frameDiff > 0 ? "+" : ""}${frameDiff.toFixed(0)})`);
        if (Math.abs(sentDiff) > 5) drivers.push(`sentiment ${sentDiff > 0 ? "turning more anti-BCBS" : "turning more anti-MM"} (${sentDiff > 0 ? "+" : ""}${sentDiff.toFixed(0)})`);
        if (Math.abs(blameDiff) > 5) drivers.push(`blame direction ${blameDiff > 0 ? "increasingly on BCBS" : "increasingly on MM"} (${blameDiff > 0 ? "+" : ""}${blameDiff.toFixed(0)})`);
        if (Math.abs(patDiff) > 5) drivers.push(`patient story saturation ${patDiff > 0 ? "increasing" : "decreasing"} (${patDiff > 0 ? "+" : ""}${patDiff.toFixed(0)})`);

        const earlySourceSet = new Set(chEarly.map((e) => e.source));
        const newSources = [...new Set(chLate.filter((e) => !earlySourceSet.has(e.source) && getWeight(e) >= 1.0).map((e) => e.source))];

        channelMomentum.push({ channel: label, shift, early: eScores.composite, late: lScores.composite, drivers, newSources, earlyCount: chEarly.length, lateCount: chLate.length });
      }
    });

    const topLateEntries = late
      .sort((a, b) => getWeight(b) - getWeight(a))
      .slice(0, 5)
      .map((e) => ({ source: e.source, headline: e.headline, weight: getWeight(e), frame: e.frameAdoption, blame: e.blameDirection }));

    return { dimShifts, channelMomentum, topLateEntries, earlyRange: `${early[0].date} – ${early[early.length - 1].date}`, lateRange: `${late[0].date} – ${late[late.length - 1].date}` };
  }, [entries]);

  const divergences = useMemo(() => {
    const results = [];
    ["media", "social", "stakeholder"].forEach((c) => {
      const cs = channelScores[c];
      if (!cs) return;
      const diff = cs.composite - scores.composite;
      if (Math.abs(diff) > 8) {
        const label = c.charAt(0).toUpperCase() + c.slice(1);
        const dir = diff > 0 ? "more favorable to Michigan Medicine" : "more favorable to BCBSM";
        results.push({ channel: label, diff, dir, score: cs.composite });
      }
    });
    return results;
  }, [channelScores, scores]);

  const keyMessages = useMemo(() => {
    const msgs = [];
    const mmFrame = entries.filter((e) => e.frameAdoption === "mm");
    const bcbsFrame = entries.filter((e) => e.frameAdoption === "bcbs");
    const mmW = mmFrame.reduce((s, e) => s + getWeight(e), 0);
    const bcbsW = bcbsFrame.reduce((s, e) => s + getWeight(e), 0);
    if (mmW > bcbsW * 1.3) msgs.push("Michigan Medicine's narrative frame leads across credible sources");
    const patientEntries = entries.filter((e) => e.patientStory);
    const patientMM = patientEntries.filter((e) => e.blameDirection === "bcbs").length;
    const patientBCBS = patientEntries.filter((e) => e.blameDirection === "mm").length;
    if (patientMM > patientBCBS) msgs.push(`Patient stories skew pro-MM (${patientMM} blame BCBS vs ${patientBCBS} blame MM) — children's hospital cases are most impactful`);
    const stakeholder = entries.filter((e) => e.channel === "stakeholder");
    const proBCBS = stakeholder.filter((e) => e.frameAdoption === "bcbs" || e.blameDirection === "mm").length;
    if (proBCBS >= 3) msgs.push("BCBS has meaningful stakeholder support — HFH and Corewell deals create 2-vs-1 pressure on MM");
    return msgs;
  }, [entries]);

  const fmtScore = (v) => `${v > 0 ? "+" : ""}${v.toFixed(0)}`;
  const S = { section: { marginBottom: 12 }, label: { fontSize: 9, letterSpacing: 1.5, color: COLORS.textMuted, fontFamily: "'JetBrains Mono', monospace", marginBottom: 6, fontWeight: 700 }, body: { fontSize: 13, color: COLORS.text, lineHeight: 1.7 }, bullet: { fontSize: 12, color: COLORS.text, lineHeight: 1.8, margin: 0, paddingLeft: 16 }, accent: { color: COLORS.amber, fontWeight: 600 }, warn: { color: "#2F65A7", fontWeight: 600 }, muted: { color: COLORS.textMuted, fontSize: 11 } };

  if (filterChannel !== "all") {
    const cs = channelScores[filterChannel];
    if (!cs) return null;
    const label = filterChannel.charAt(0).toUpperCase() + filterChannel.slice(1);
    const allScores = computeScores(entries);
    const diff = cs.composite - allScores.composite;
    const diffDir = diff > 5 ? "stronger for Michigan Medicine" : diff < -5 ? "stronger for BCBSM" : "roughly aligned with";

    const channelEntries = entries.filter((e) => e.channel === filterChannel);
    const topSources = {};
    channelEntries.forEach((e) => { topSources[e.source] = (topSources[e.source] || 0) + getWeight(e); });
    const sortedSources = Object.entries(topSources).sort((a, b) => b[1] - a[1]).slice(0, 3);

    const takeaways = [];
    if (filterChannel === "media") {
      const tier1_2 = channelEntries.filter((e) => getWeight(e) >= 1.2);
      const tier1_2MM = tier1_2.filter((e) => e.frameAdoption === "mm").length;
      const tier1_2BCBS = tier1_2.filter((e) => e.frameAdoption === "bcbs").length;
      const tier1_2Bal = tier1_2.filter((e) => e.frameAdoption === "balanced").length;
      takeaways.push(`Of ${tier1_2.length} high-credibility media entries (Tier 1–2), ${tier1_2MM} adopt MM's frame, ${tier1_2BCBS} adopt BCBS's frame, and ${tier1_2Bal} are balanced.`);
      takeaways.push("Crain's Detroit is the most influential single outlet — business audience shapes employer perception of both parties.");
      takeaways.push("Grasso's Regents speech (Detroit News) escalated the rhetoric to institutional level — university president publicly accused BCBS of lying.");
      const patientMedia = channelEntries.filter((e) => e.patientStory);
      if (patientMedia.length > 0) takeaways.push(`${patientMedia.length} media entries feature patient stories — Mott Children's Hospital cases are most emotionally resonant.`);
    } else if (filterChannel === "social") {
      const organic = channelEntries.filter((e) => getWeight(e) >= 0.7 && getWeight(e) < 1.0);
      const comments = channelEntries.filter((e) => getWeight(e) < 0.5);
      takeaways.push(`${organic.length} organic social posts (0.7x weight), ${comments.length} comment section entries (0.4x weight).`);
      takeaways.push("Threads is the dominant social platform for this dispute — @michellewhisks viral post (75+ likes, 60+ replies) set the tone.");
      takeaways.push("CEO compensation ($6.9M) and nonprofit status criticism are the most viral social angles — emotional, shareable, hard for BCBS to rebut.");
      if (cs.blameScore > 20) takeaways.push("Social blame direction is strongly anti-BCBS, but single-payer advocacy threads dilute the pro-MM signal.");
    } else if (filterChannel === "stakeholder") {
      const actions = channelEntries.filter((e) => getWeight(e) >= 1.3);
      takeaways.push(`${actions.length} stakeholder entries at 1.3x weight — this is where BCBS has its strongest counter-narrative.`);
      const proBCBS = channelEntries.filter((e) => e.blameDirection === "mm" || e.frameAdoption === "bcbs");
      const proMM = channelEntries.filter((e) => e.blameDirection === "bcbs" || e.frameAdoption === "mm");
      takeaways.push(`Henry Ford + Corewell value-based deals create "2-vs-1" pressure — MM is the holdout among the Big 3.`);
      takeaways.push("DIFS (state insurance regulator) has declined to intervene — no regulatory pressure on either side. Governor Whitmer is silent.");
      takeaways.push("No stakeholder has bypassed BCBS to validate MM's pricing directly — no external party has independently confirmed MM's cost claims.");
    }

    return (
      <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: "20px 24px", marginBottom: 20 }}>
        <div style={S.label}>EXECUTIVE BRIEF — {label.toUpperCase()} CHANNEL</div>
        <div style={S.body}>
          <span style={S.accent}>{label} composite: {fmtScore(cs.composite)}</span> — {diffDir} the overall score ({fmtScore(allScores.composite)}).
          {channelEntries.length} entries tracked in this channel.
        </div>
        <div style={{ ...S.label, marginTop: 14 }}>TOP SOURCES BY WEIGHTED INFLUENCE</div>
        <ul style={{ ...S.bullet, listStyle: "none" }}>
          {sortedSources.map(([src, w]) => <li key={src}>▸ {src} <span style={S.muted}>(cumulative weight: {w.toFixed(1)})</span></li>)}
        </ul>
        <div style={{ ...S.label, marginTop: 14 }}>KEY TAKEAWAYS</div>
        <ul style={{ ...S.bullet, listStyle: "none" }}>
          {takeaways.map((t, i) => <li key={i} style={{ marginBottom: 4 }}>▸ {t}</li>)}
        </ul>
        {trendDrivers && trendDrivers.channelMomentum.filter((cm) => cm.channel.toLowerCase() === filterChannel).length > 0 && (
          <>
            <div style={{ ...S.label, marginTop: 14 }}>TREND DRIVERS</div>
            {trendDrivers.channelMomentum.filter((cm) => cm.channel.toLowerCase() === filterChannel).map((cm) => (
              <div key={cm.channel}>
                <div style={{ ...S.body, marginBottom: 6 }}>
                  This channel moved <span style={cm.shift > 0 ? S.accent : S.warn}>{cm.shift > 0 ? "+" : ""}{cm.shift.toFixed(0)} pts</span> from early ({fmtScore(cm.early)}) to recent ({fmtScore(cm.late)}) coverage.
                </div>
                {cm.drivers.length > 0 && (
                  <ul style={{ ...S.bullet, listStyle: "none" }}>
                    {cm.drivers.map((d, i) => <li key={i} style={{ marginBottom: 3 }}>▸ {d}</li>)}
                  </ul>
                )}
                {cm.newSources.length > 0 && (
                  <div style={{ ...S.body, marginTop: 4 }}>
                    New high-credibility sources: <span style={S.muted}>{cm.newSources.join(", ")}</span>
                  </div>
                )}
              </div>
            ))}
          </>
        )}
      </div>
    );
  }

  return (
    <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: "20px 24px", marginBottom: 20 }}>
      <div style={S.label}>EXECUTIVE SUMMARY</div>
      <div style={{ ...S.body, marginBottom: 14 }}>
        <span style={S.accent}>Michigan Medicine holds a narrative advantage</span> with a credibility-weighted composite of <strong>{fmtScore(scores.composite)}</strong>, though the margin is tighter than in comparable disputes.
        {momentum && momentum.shift > 5 && <> Momentum is <span style={S.accent}>building for MM</span> — recent coverage scores {fmtScore(momentum.late)} vs {fmtScore(momentum.early)} in earlier coverage.</>}
        {momentum && momentum.shift < -5 && <> Momentum is <span style={S.warn}>shifting toward BCBS</span> — recent coverage scores {fmtScore(momentum.late)} vs {fmtScore(momentum.early)} earlier.</>}
        {momentum && Math.abs(momentum.shift) <= 5 && <> Momentum is <strong>holding steady</strong> — no significant shift between early and recent coverage.</>}
        {" "}The June 30 deadline is 97 days away — expect coverage intensity to accelerate sharply in May.
      </div>

      {trendDrivers && (trendDrivers.dimShifts.length > 0 || trendDrivers.channelMomentum.length > 0) && (
        <div style={S.section}>
          <div style={S.label}>TREND DRIVERS — WHAT'S CAUSING THE SHIFT</div>
          <div style={{ fontSize: 11, color: COLORS.textMuted, marginBottom: 8 }}>
            Comparing early period ({trendDrivers.earlyRange}) vs recent period ({trendDrivers.lateRange})
          </div>
          {trendDrivers.dimShifts.length > 0 && (
            <>
              <div style={{ fontSize: 10, letterSpacing: 1, color: COLORS.textMuted, fontFamily: "'JetBrains Mono', monospace", marginBottom: 4, marginTop: 8 }}>DIMENSION SHIFTS</div>
              <ul style={{ ...S.bullet, listStyle: "none" }}>
                {trendDrivers.dimShifts.map((d) => (
                  <li key={d.name} style={{ marginBottom: 4 }}>
                    ▸ <strong>{d.name}</strong> ({d.weight}): moved <span style={d.shift > 0 ? S.accent : S.warn}>{d.shift > 0 ? "+" : ""}{d.shift.toFixed(0)} pts</span> — from {fmtScore(d.early)} to {fmtScore(d.late)}.
                    {d.key === "frameScore" && d.shift > 0 && " More recent coverage is adopting Michigan Medicine's framing."}
                    {d.key === "frameScore" && d.shift < 0 && " BCBS's framing is gaining traction in recent coverage."}
                    {d.key === "sentScore" && d.shift > 0 && " Recent tone has turned more critical of BCBS."}
                    {d.key === "sentScore" && d.shift < 0 && " Recent tone has softened toward BCBS or hardened toward MM."}
                    {d.key === "blameScore" && d.shift > 0 && " Sources are increasingly holding BCBS responsible."}
                    {d.key === "blameScore" && d.shift < 0 && " Blame is shifting toward Michigan Medicine in recent coverage."}
                    {d.key === "patientScore" && d.shift > 0 && " Patient stories are appearing more frequently, reinforcing the human cost narrative."}
                    {d.key === "patientScore" && d.shift < 0 && " Fewer patient stories in recent coverage — the human angle is fading."}
                  </li>
                ))}
              </ul>
            </>
          )}
          {trendDrivers.channelMomentum.length > 0 && (
            <>
              <div style={{ fontSize: 10, letterSpacing: 1, color: COLORS.textMuted, fontFamily: "'JetBrains Mono', monospace", marginBottom: 4, marginTop: 12 }}>CHANNEL MOMENTUM</div>
              <ul style={{ ...S.bullet, listStyle: "none" }}>
                {trendDrivers.channelMomentum.map((cm) => (
                  <li key={cm.channel} style={{ marginBottom: 6 }}>
                    ▸ <strong>{cm.channel}</strong>: <span style={cm.shift > 0 ? S.accent : S.warn}>{cm.shift > 0 ? "+" : ""}{cm.shift.toFixed(0)} pts</span> ({fmtScore(cm.early)} → {fmtScore(cm.late)}, {cm.earlyCount} → {cm.lateCount} entries).
                    {cm.drivers.length > 0 && <> Driven by: {cm.drivers.join("; ")}.</>}
                    {cm.newSources.length > 0 && <> New high-credibility sources entering: <span style={S.muted}>{cm.newSources.join(", ")}</span>.</>}
                  </li>
                ))}
              </ul>
            </>
          )}
          {trendDrivers.topLateEntries.length > 0 && (
            <>
              <div style={{ fontSize: 10, letterSpacing: 1, color: COLORS.textMuted, fontFamily: "'JetBrains Mono', monospace", marginBottom: 4, marginTop: 12 }}>HIGHEST-IMPACT RECENT ENTRIES</div>
              <ul style={{ ...S.bullet, listStyle: "none" }}>
                {trendDrivers.topLateEntries.map((e, i) => (
                  <li key={i} style={{ marginBottom: 3 }}>
                    ▸ <span style={S.muted}>{e.weight.toFixed(1)}x</span> {e.source} — <em>{e.headline.length > 80 ? e.headline.slice(0, 80) + "…" : e.headline}</em>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}

      {divergences.length > 0 && (
        <div style={S.section}>
          <div style={S.label}>CHANNEL DIVERGENCES</div>
          <ul style={{ ...S.bullet, listStyle: "none" }}>
            {divergences.map((d) => (
              <li key={d.channel} style={{ marginBottom: 2 }}>
                ▸ <strong>{d.channel}</strong> ({fmtScore(d.score)}) is {d.dir} than the overall composite — {
                  d.diff > 0 ? "amplifying MM's advantage" : "partially offsetting it"
                }.
              </li>
            ))}
          </ul>
        </div>
      )}

      <div style={S.section}>
        <div style={S.label}>KEY MESSAGES RESONATING</div>
        <ul style={{ ...S.bullet, listStyle: "none" }}>
          {keyMessages.map((m, i) => <li key={i} style={{ marginBottom: 2 }}>▸ {m}</li>)}
          <li style={{ marginBottom: 2 }}>▸ "Only academic medical center in Michigan" is the stickiest message — creates urgency around specialized care that can't be found elsewhere.</li>
          <li style={{ marginBottom: 2 }}>▸ BCBS CEO compensation ($6.9M) paired with $246M loss is the most viral counter-frame — undercuts BCBS's affordability argument.</li>
          <li style={{ marginBottom: 2 }}>▸ "44% increase" has traction with employers even though MM disputes it — BCBS is winning the employer audience more than the patient audience.</li>
          {topPatientStories.length > 0 && (
            <li style={{ marginBottom: 2 }}>▸ Top patient stories: {topPatientStories.map((e) => e.headline.split("—")[0].trim()).join("; ")}.</li>
          )}
        </ul>
      </div>

      <div style={S.section}>
        <div style={S.label}>MARCOMM CONSIDERATIONS</div>
        <ul style={{ ...S.bullet, listStyle: "none" }}>
          <li style={{ marginBottom: 2 }}>▸ <strong>The "Big 3" dynamic is the core challenge.</strong> Henry Ford and Corewell signed value-based deals — MM is the holdout. BCBS can credibly say "two out of three agreed." MM needs to differentiate why academic medicine requires different terms.</li>
          <li style={{ marginBottom: 2 }}>▸ <strong>Children's hospital stories are the most powerful weapon.</strong> Mott Children's Hospital cases (Crohn's, cerebral palsy, developmental disability) generate intense sympathy. Prioritize these in earned media.</li>
          <li style={{ marginBottom: 2 }}>▸ <strong>Employer audience is the swing constituency.</strong> 60% of BCBS members are self-insured employer plans. BCBS's "lock out" framing to employers is creating counter-pressure. MM needs employer allies.</li>
          <li style={{ marginBottom: 2 }}>▸ <strong>BCBS financial losses are genuine.</strong> $1.03B (2024) + $246M (2025) + $1.1B GLP-1 costs. This is not a fabricated hardship narrative — but CEO compensation undercuts the sympathy.</li>
          {channelScores.social && channelScores.media && Math.abs(channelScores.social.composite - channelScores.media.composite) > 15 && (
            <li style={{ marginBottom: 2 }}>▸ <strong>Social-media gap:</strong> Social ({fmtScore(channelScores.social.composite)}) diverges from media ({fmtScore(channelScores.media.composite)}) — {
              channelScores.social.composite > channelScores.media.composite
                ? "grassroots anger is running hotter than press coverage reflects. Organic sentiment may be outpacing the earned media narrative."
                : "media coverage is more favorable than organic conversation. Earned media wins may not be translating to public perception."
            }</li>
          )}
          <li style={{ marginBottom: 2 }}>▸ <strong>Timeline is the wildcard.</strong> As June 30 approaches, patient anxiety stories will accelerate. Prepare for a surge of "my child's care is at risk" coverage in late May / early June.</li>
        </ul>
      </div>
    </div>
  );
}

function ScoreGauge({ value, label, subtext }) {
  const clamped = Math.max(-100, Math.min(100, value));
  const pct = ((clamped + 100) / 200) * 100;
  const color = clamped > 15 ? COLORS.red : clamped < -15 ? COLORS.bcbs : COLORS.amber;
  const winner = clamped > 10 ? "→ MM Advantage" : clamped < -10 ? "→ BCBS Advantage" : "→ Contested";

  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: COLORS.text, fontFamily: "'JetBrains Mono', monospace" }}>{label}</span>
        <span style={{ fontSize: 11, color, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>
          {clamped > 0 ? "+" : ""}
          {clamped.toFixed(0)} {winner}
        </span>
      </div>
      <div style={{ height: 8, background: COLORS.border, borderRadius: 4, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 2, background: COLORS.textMuted, opacity: 0.4, zIndex: 2 }} />
        <div
          style={{
            position: "absolute",
            left: clamped >= 0 ? "50%" : `${pct}%`,
            width: `${Math.abs(clamped) / 2}%`,
            top: 0,
            bottom: 0,
            background: color,
            borderRadius: 4,
            transition: "all 0.3s ease",
          }}
        />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 3 }}>
        <span style={{ fontSize: 10, color: COLORS.textMuted }}>BCBS Winning</span>
        <span style={{ fontSize: 10, color: COLORS.textMuted }}>{subtext}</span>
        <span style={{ fontSize: 10, color: COLORS.textMuted }}>MM Winning</span>
      </div>
    </div>
  );
}

function DistBar({ label, values, colors, labels: segLabels }) {
  const total = values.reduce((a, b) => a + b, 0) || 1;
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 11, color: COLORS.textMuted, marginBottom: 4, fontFamily: "'JetBrains Mono', monospace" }}>{label}</div>
      <div style={{ display: "flex", height: 24, borderRadius: 4, overflow: "hidden", gap: 1 }}>
        {values.map((v, i) =>
          v > 0 ? (
            <div
              key={i}
              style={{
                width: `${(v / total) * 100}%`,
                background: colors[i],
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 10,
                color: "#fff",
                fontWeight: 700,
                fontFamily: "'JetBrains Mono', monospace",
                minWidth: v > 0 ? 28 : 0,
              }}
            >
              {v} {segLabels[i]}
            </div>
          ) : null
        )}
      </div>
    </div>
  );
}

function EntryRow({ entry, onDelete }) {
  const sentColor =
    entry.sentiment === "negative_bcbs" || entry.sentiment === "positive_mm"
      ? COLORS.red
      : entry.sentiment === "negative_mm" || entry.sentiment === "positive_bcbs"
      ? "#2F65A7"
      : COLORS.textMuted;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "90px 1fr 100px 90px 90px 36px",
        gap: 8,
        padding: "10px 12px",
        borderBottom: `1px solid ${COLORS.border}`,
        alignItems: "center",
        fontSize: 12,
        color: COLORS.text,
      }}
    >
      <span style={{ color: COLORS.textMuted, fontFamily: "'JetBrains Mono', monospace", fontSize: 11 }}>{entry.date}</span>
      <div>
        <div style={{ fontWeight: 600, fontSize: 12, lineHeight: 1.3 }}>{entry.headline || entry.source}</div>
        <div style={{ color: COLORS.textMuted, fontSize: 11, marginTop: 2 }}>
          {entry.source} · {LABELS.sourceType[entry.sourceType]} {entry.patientStory ? " · 👤 Patient story" : ""}
        </div>
        {entry.notes && <div style={{ color: COLORS.textMuted, fontSize: 10, marginTop: 3, fontStyle: "italic", lineHeight: 1.4 }}>{entry.notes}</div>}
      </div>
      <span
        style={{
          fontSize: 10,
          padding: "3px 8px",
          borderRadius: 3,
          fontWeight: 700,
          fontFamily: "'JetBrains Mono', monospace",
          background: entry.frameAdoption === "mm" ? "#5C1F14" : entry.frameAdoption === "bcbs" ? "#003A72" : "#1A4A7A",
          color: entry.frameAdoption === "mm" ? "#FFCB05" : entry.frameAdoption === "bcbs" ? "#8FAAC4" : "#8FAAC4",
          textAlign: "center",
        }}
      >
        {LABELS.frameAdoption[entry.frameAdoption]}
      </span>
      <span style={{ color: sentColor, fontWeight: 600, fontSize: 11, fontFamily: "'JetBrains Mono', monospace" }}>
        {LABELS.sentiment[entry.sentiment]}
      </span>
      <span style={{ fontSize: 10, color: COLORS.textMuted }}>{LABELS.reachEstimate[entry.reachEstimate]} reach</span>
      <button
        onClick={() => onDelete(entry.id)}
        style={{ background: "none", border: "none", color: COLORS.textMuted, cursor: "pointer", fontSize: 14, padding: 2 }}
        title="Remove entry"
      >
        ✕
      </button>
    </div>
  );
}

export default function PRWarRoom() {
  const [entries, setEntries] = useState(INITIAL_ENTRIES);
  const [filterChannel, setFilterChannel] = useState("all");

  const filtered = useMemo(
    () => (filterChannel === "all" ? entries : entries.filter((e) => e.channel === filterChannel)),
    [entries, filterChannel]
  );
  const scores = useMemo(() => computeScores(filtered), [filtered]);

  const deleteEntry = useCallback((id) => setEntries((prev) => prev.filter((e) => e.id !== id)), []);

  const compositeColor = scores.composite > 15 ? COLORS.red : scores.composite < -15 ? "#2F65A7" : COLORS.amber;
  const compositeLabel = scores.composite > 15 ? "MICHIGAN MEDICINE" : scores.composite < -15 ? "BCBSM" : "CONTESTED";

  return (
    <div
      style={{
        background: COLORS.bg,
        color: COLORS.text,
        minHeight: "100vh",
        fontFamily: "'Source Serif 4', Georgia, serif",
        padding: "24px 20px",
      }}
    >
      <link href="https://fonts.googleapis.com/css2?family=Source+Serif+4:wght@400;600;700&family=JetBrains+Mono:wght@400;600;700&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
          <span style={{ fontSize: 10, letterSpacing: 3, color: COLORS.amber, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>
            NARRATIVE INTELLIGENCE
          </span>
          <span style={{ height: 1, flex: 1, background: COLORS.border }} />
        </div>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, letterSpacing: -0.5, lineHeight: 1.2 }}>
          PR War Room <span style={{ color: COLORS.textMuted, fontWeight: 400 }}>— BCBSM vs Michigan Medicine</span>
        </h1>
        <p style={{ margin: "6px 0 0", fontSize: 12, color: COLORS.textMuted, fontFamily: "'JetBrains Mono', monospace" }}>
          Contract dispute · Deadline June 30, 2026 · {filtered.length} entries tracked
        </p>
      </div>

      {/* Composite Score */}
      <div
        style={{
          background: `linear-gradient(135deg, ${COLORS.surface}, ${COLORS.bg})`,
          border: `1px solid ${COLORS.border}`,
          borderRadius: 10,
          padding: "20px 24px",
          marginBottom: 20,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: compositeColor }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
          <div>
            <div style={{ fontSize: 10, letterSpacing: 2, color: COLORS.textMuted, fontFamily: "'JetBrains Mono', monospace", marginBottom: 6 }}>
              COMPOSITE NARRATIVE ADVANTAGE
            </div>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.25)", fontFamily: "'JetBrains Mono', monospace", marginBottom: 8 }}>
              Monitoring period: Jan 1, 2026 — Present
            </div>
            <div style={{ fontSize: 40, fontWeight: 700, color: compositeColor, fontFamily: "'JetBrains Mono', monospace", lineHeight: 1 }}>
              {scores.composite > 0 ? "+" : ""}
              {scores.composite.toFixed(1)}
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, color: compositeColor, marginTop: 4 }}>{compositeLabel}</div>
          </div>
          <div style={{ textAlign: "right", fontSize: 11, color: COLORS.textMuted, lineHeight: 1.8, fontFamily: "'JetBrains Mono', monospace" }}>
            <div>Frame Adoption (30%): <span style={{ color: COLORS.text }}>{scores.frameScore > 0 ? "+" : ""}{scores.frameScore.toFixed(0)}</span></div>
            <div>Sentiment (30%): <span style={{ color: COLORS.text }}>{scores.sentScore > 0 ? "+" : ""}{scores.sentScore.toFixed(0)}</span></div>
            <div>Blame Direction (25%): <span style={{ color: COLORS.text }}>{scores.blameScore > 0 ? "+" : ""}{scores.blameScore.toFixed(0)}</span></div>
            <div>Patient Story Saturation (15%): <span style={{ color: COLORS.text }}>{scores.patientScore.toFixed(0)}%</span></div>
          </div>
        </div>
        <TrendChart entries={entries} filterChannel={filterChannel} />
      </div>

      {/* Filter tabs */}
      <div style={{ display: "flex", gap: 4, marginBottom: 16 }}>
        {[
          ["all", `All (${entries.length})`],
          ["media", `Media (${entries.filter((e) => e.channel === "media").length})`],
          ["social", `Social (${entries.filter((e) => e.channel === "social").length})`],
          ["stakeholder", `Stakeholder (${entries.filter((e) => e.channel === "stakeholder").length})`],
        ].map(([k, label]) => (
          <button
            key={k}
            onClick={() => setFilterChannel(k)}
            style={{
              padding: "6px 14px",
              fontSize: 11,
              fontFamily: "'JetBrains Mono', monospace",
              fontWeight: 600,
              borderRadius: 4,
              border: "none",
              cursor: "pointer",
              background: filterChannel === k ? COLORS.amber : COLORS.surface,
              color: filterChannel === k ? COLORS.bg : COLORS.textMuted,
            }}
          >
            {label}
          </button>
        ))}
      </div>

      <ExecutiveSummary entries={entries} filterChannel={filterChannel} scores={scores} />

      {/* Gauges + Distributions */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
        <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: 16 }}>
          <div style={{ fontSize: 11, letterSpacing: 1.5, color: COLORS.textMuted, fontFamily: "'JetBrains Mono', monospace", marginBottom: 14 }}>
            DIMENSION SCORES
          </div>
          <ScoreGauge value={scores.frameScore} label="Frame Adoption" subtext="Whose numbers get cited?" />
          <ScoreGauge value={scores.sentScore} label="Sentiment" subtext="Tone of coverage" />
          <ScoreGauge value={scores.blameScore} label="Blame Direction" subtext="Who's the villain?" />
          <div style={{ marginTop: 8, padding: "8px 10px", background: COLORS.bg, borderRadius: 4, fontSize: 11, color: COLORS.textMuted }}>
            <strong style={{ color: COLORS.amber }}>Patient Story Saturation:</strong>{" "}
            {scores.patientStories}/{scores.total} entries ({scores.patientScore.toFixed(0)}%) — favors MM as provider
          </div>
        </div>

        <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: 16 }}>
          <div style={{ fontSize: 11, letterSpacing: 1.5, color: COLORS.textMuted, fontFamily: "'JetBrains Mono', monospace", marginBottom: 14 }}>
            DISTRIBUTIONS
          </div>
          <DistBar
            label="FRAME ADOPTION"
            values={[scores.frameMM, scores.frameBalanced, scores.frameBCBS]}
            colors={["#9A3324", "#465E85", "#2F65A7"]}
            labels={["MM", "BAL", "BCBS"]}
          />
          <DistBar
            label="SENTIMENT"
            values={[scores.sentNegBCBS, scores.sentNeutral, scores.sentNegMM]}
            colors={["#9A3324", "#465E85", "#2F65A7"]}
            labels={["Anti-BCBS", "Neutral", "Anti-MM"]}
          />
          <DistBar
            label="BLAME DIRECTION"
            values={[scores.blameBCBS, scores.blameBoth, scores.blameMM]}
            colors={["#9A3324", "#465E85", "#2F65A7"]}
            labels={["BCBS", "Both", "MM"]}
          />
          <div style={{ marginTop: 16, padding: 12, background: COLORS.bg, borderRadius: 6, fontSize: 11, lineHeight: 1.7, color: COLORS.textMuted }}>
            <strong style={{ color: COLORS.amber }}>SCORING METHODOLOGY</strong>
            <br />
            Each dimension: (pro-MM count − pro-BCBS count) / total × 100
            <br />
            Positive = MM winning · Negative = BCBS winning
            <br />
            Composite = Frame(30%) + Sentiment(30%) + Blame(25%) + PatientStory(15%)
            <br />
            <span style={{ color: COLORS.text }}>Add social/forum and stakeholder entries to strengthen the signal.</span>
          </div>
        </div>
      </div>

      {/* Per-channel Entry Logs */}
      {(filterChannel === "all" ? ["media", "social", "stakeholder"] : [filterChannel]).map((ch) => {
        const chEntries = entries.filter((e) => e.channel === ch).sort((a, b) => b.date.localeCompare(a.date));
        const chLabel = ch === "media" ? "MEDIA" : ch === "social" ? "SOCIAL / FORUM" : "STAKEHOLDER";
        const chColor = ch === "media" ? "#2F65A7" : ch === "social" ? "#00B2A9" : "#D86018";
        return (
          <div key={ch} style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 8, overflow: "hidden", marginBottom: 16 }}>
            <div style={{ padding: "12px 16px", borderBottom: `1px solid ${COLORS.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: chColor, display: "inline-block" }} />
                <span style={{ fontSize: 11, letterSpacing: 1.5, color: COLORS.textMuted, fontFamily: "'JetBrains Mono', monospace" }}>{chLabel} LOG</span>
              </div>
              <span style={{ fontSize: 11, color: COLORS.textMuted }}>{chEntries.length} entries</span>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "90px 1fr 100px 90px 90px 36px",
                gap: 8,
                padding: "8px 12px",
                borderBottom: `1px solid ${COLORS.border}`,
                fontSize: 10,
                color: COLORS.textMuted,
                fontFamily: "'JetBrains Mono', monospace",
                letterSpacing: 0.5,
              }}
            >
              <span>DATE</span>
              <span>SOURCE / HEADLINE</span>
              <span>FRAME</span>
              <span>SENTIMENT</span>
              <span>REACH</span>
              <span></span>
            </div>
            {chEntries.map((entry) => (
              <EntryRow key={entry.id} entry={entry} onDelete={deleteEntry} />
            ))}
          </div>
        );
      })}

    </div>
  );
}
