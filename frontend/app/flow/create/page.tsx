"use client";
import { BACKEND_URL } from "@/app/config";
import { Appbar } from "@/components/Appbar";
import FlowBuilder from "@/components/FlowBuilder";
import { Edge, Node } from "@xyflow/react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface AvailableTrigger {
    id: string;
    name: string;
    image: string;
}

interface AvailableAction {
    id: string;
    name: string;
    image: string;
}

function useAvailableActionsAndTriggers() {
    const [availableActions, setAvailableActions] = useState<AvailableAction[]>([]);
    const [availableTriggers, setAvailableTriggers] = useState<AvailableTrigger[]>([]);

    useEffect(() => {
        axios.get(`${BACKEND_URL}/api/v1/trigger/available`)
            .then(x => setAvailableTriggers(x.data.availableTriggers))
            .catch(e => console.error("Trigger fetch failed:", e.message));

        axios.get(`${BACKEND_URL}/api/v1/action/available`)
            .then(x => setAvailableActions(x.data.availableActions))
            .catch(e => console.error("Action fetch failed:", e.message));
    }, [])

    return {
        availableActions,
        availableTriggers
    }
}

export default function CreateFlow() {
    const router = useRouter();
    const { availableActions, availableTriggers } = useAvailableActionsAndTriggers();

    const handleSave = async (nodes: Node[], edges: Edge[]) => {
        const triggerNode = nodes.find(n => n.type === 'trigger');
        if (!triggerNode) return alert("Please add a trigger");

        // Calculate stages (levels) for actions
        const actionNodes = nodes.filter(n => n.type === 'action');
        const stages: Record<string, number> = {};

        // BFS to find levels from trigger
        let queue = [{ id: triggerNode.id, level: -1 }];
        while (queue.length > 0) {
            const { id, level } = queue.shift()!;
            const children = edges.filter(e => e.source === id).map(e => e.target);
            for (const childId of children) {
                if (!(childId in stages) || stages[childId] < level + 1) {
                    stages[childId] = level + 1;
                    queue.push({ id: childId, level: level + 1 });
                }
            }
        }

        try {
            await axios.post(`${BACKEND_URL}/api/v1/zap`, {
                availableTriggerId: triggerNode.data.availableTriggerId || "webhook", // Default
                triggerMetadata: triggerNode.data.metadata || {},
                actions: actionNodes.map((a) => ({
                    availableActionId: a.data.availableActionId || "email", // Default
                    actionMetadata: a.data.metadata || {},
                    sortingOrder: stages[a.id] ?? 0
                }))
            }, {
                headers: { Authorization: localStorage.getItem("token") }
            });
            router.push("/dashboard");
        } catch (e) {
            console.error(e);
            alert("Failed to publish workflow");
        }
    };

    return (
        <div className="bg-slate-50 min-h-screen">
            <Appbar />
            <div className="p-8">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Create your Flow</h1>
                        <p className="text-slate-500 mt-1">Design and automate your workflows with ease.</p>
                    </div>
                </div>

                <FlowBuilder onSave={handleSave} availableTriggers={availableTriggers} availableActions={availableActions} />
            </div>
        </div>
    );
}
