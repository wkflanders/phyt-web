import { ApiError, PackDetails, PackPurchaseNotif, PackPurchaseResponse } from "@phyt/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export async function fetchPackDetails(): Promise<PackDetails> {
    console.log(BigInt(Math.floor(Date.now() / 1000)));
    const response = await fetch(`${API_URL}/packs/init`, {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    const data = await response.json();

    if (!response.ok) {
        throw {
            error: data.error || 'Failed to purchase pack',
            status: response.status
        } as ApiError;
    }

    return data;
}

export async function notifyServerPackTxn({
    buyerId,
    hash,
    packPrice
}: PackPurchaseNotif): Promise<PackPurchaseResponse> {
    const resp = await fetch(`${API_URL}/packs/purchase`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ buyerId, hash, packPrice }),
    });

    if (!resp.ok) {
        const data = await resp.json().catch(() => ({}));
        throw {
            error: data.error || 'Error notifying server',
            status: resp.status,
        } as ApiError;
    }

    return resp.json();
}