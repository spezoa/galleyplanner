import Link from "next/link";
import { listPlans } from "../../server/actions";

export default async function PlansPage() {
  const plans = await listPlans();
  return (
    <div>
      <h1>Plans</h1>
      <ul>
        {plans.map(p => (
          <li key={p.id} className="border rounded p-2 bg-white" style={{marginBottom: '.5rem'}}>
            <div><b>{p.name}</b> — {p.status}</div>
            <div className="small">Aircraft: {p.aircraft?.tail ?? 'N/A'}</div>
            <div style={{marginTop: '.5rem'}}>
              <Link className="btn outline" href={`/plans/${p.id}`}>Open</Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
