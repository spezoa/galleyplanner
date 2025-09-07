export async function createPlanIfMissing(planId?: string) {
  if (planId) return;
  await fetch('/api/dev/create-plan', { method: 'POST' });
}

export async function savePlacement(planId: string | undefined, pl: any) {
  await fetch('/api/dev/save-placement', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ planId, pl }) });
}

export async function removePlacement(planId: string | undefined, placementId: string) {
  await fetch('/api/dev/remove-placement', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ planId, placementId }) });
}

export async function publishPlan(planId: string | undefined) {
  await fetch('/api/dev/publish', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ planId }) });
}
