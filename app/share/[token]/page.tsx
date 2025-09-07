import { getPlanByToken } from "../../server";
import QRCode from "qrcode";

export default async function SharePage({ params }: { params: { token: string }}) {
  const data = await getPlanByToken(params.token);
  if (!data) return <div>Invalid token.</div>;
  const { plan, placements, station } = data;
  // Generate a small QR (data URL) that points back to this share page
  const url = `${process.env.NEXTAUTH_URL ?? "http://localhost:3000"}/share/${params.token}`;
  const qr = await QRCode.toDataURL(url);
  return (
    <div className="border rounded p-4 bg-white">
      <h1>{plan.name} — Published</h1>
      <img src={qr} alt="Share QR" width={120} height={120}/>
      <p className="small">Scan to open on mobile.</p>
      <h2>Station Preview</h2>
      <div style={{border:'1px solid #e5e7eb', padding: '1rem'}}>
        <svg width="600" height="400" viewBox="0 0 600 400">
          <rect x="10" y="10" width="580" height="380" fill="#fff" stroke="#000"/>
          {placements.map((pl:any, idx:number) => (
            <g key={idx} transform={`translate(${pl.xMm/2},${pl.yMm/2}) rotate(${pl.rotateDeg})`}>
              <rect width="40" height="20" fill="none" stroke="#333"/>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}
