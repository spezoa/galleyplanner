import { getPlan } from "../../../server/actions";
import Link from "next/link";

export default async function PlanDetail({ params }: { params: { id: string }}) {
  const plan = await getPlan(params.id);
  if (!plan) return <div>Not found</div>;
  return (
    <div className="border rounded p-4 bg-white">
      <h1>{plan.name}</h1>
      <div className="small">Status: {plan.status} · Aircraft: {plan.aircraft?.tail}</div>
      <div style={{marginTop: '1rem'}}>
        <Link className="btn" href={`/designer?planId=${plan.id}`}>Edit in Designer</Link>
      </div>
      <div style={{marginTop: '1rem'}}>
        {plan.currentVersionId ? (
          <a className="btn outline" href={`/share/${plan.currentVersion?.token}`} target="_blank">Open Share Link</a>
        ) : <span className="small">No published version yet.</span>}
      </div>
    </div>
  );
}
