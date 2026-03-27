// Logo paths keyed by providerKey / payorKey
// Logos are stored in /public/logos/ as favicons from org domains

const LOGOS = {
  // Payors
  cigna: "/logos/cigna.png",
  aetna: "/logos/aetna.png",
  uhc: "/logos/uhc.png",
  anthem: "/logos/anthem.png",
  bcbs: "/logos/bcbs.png",
  bcbstx: "/logos/bcbstx.png",
  bcbsaz: "/logos/bcbsaz.png",

  // Providers
  ahn: "/logos/ahn.png",
  mm: "/logos/mm.png",
  bonsecours: "/logos/bonsecours.png",
  bsw: "/logos/bsw.png",
  dignity: "/logos/dignity.png",
  duke: "/logos/duke.png",
  hhc: "/logos/hhc.png",
  huntsville: "/logos/huntsville.png",
  jefferson: "/logos/jefferson.png",
  mainline: "/logos/mainline.png",
  mh: "/logos/mh.png",
  msk: "/logos/msk.png",
  mtsinai: "/logos/mtsinai.png",
  mu: "/logos/mu.png",
  nlight: "/logos/nlight.png",
  osu: "/logos/osu.png",
  piedmont: "/logos/piedmont.png",
  providence: "/logos/providence.png",
  scripps: "/logos/scripps.png",
  spartanburg: "/logos/spartanburg.png",
  tenet: "/logos/tenet.png",
  unc: "/logos/unc.png",
  uw: "/logos/uw.png",
};

export function getLogoUrl(key) {
  return LOGOS[key] || null;
}

export function OrgLogo({ orgKey, size = 28, style = {} }) {
  const src = LOGOS[orgKey];
  if (!src) return null;
  return (
    <img
      src={src}
      alt=""
      style={{
        width: size,
        height: size,
        borderRadius: 4,
        objectFit: "contain",
        flexShrink: 0,
        ...style,
      }}
      onError={(e) => { e.target.style.display = "none"; }}
    />
  );
}

export default LOGOS;
