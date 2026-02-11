import { useState, useCallback, useEffect } from "react";
import { Sparkles, GitBranch, List, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import ReactFlow, { Node, Edge, Background, Controls, MiniMap, useNodesState, useEdgesState, Position } from "reactflow";
import "reactflow/dist/style.css";
import dagre from "dagre";
import { generateRoadmap } from "@/lib/groq";
import { useToast } from "@/hooks/use-toast";
import { useDatabase } from "@/hooks/use-database";
import { useLocation } from "react-router-dom";

const getLayoutedElements = (nodes: Node[], edges: Edge[], direction = "TB") => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  const nodeWidth = 300;
  const nodeHeight = 80;

  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    node.targetPosition = isHorizontal ? Position.Left : Position.Top;
    node.sourcePosition = isHorizontal ? Position.Right : Position.Bottom;

    // We are shifting the dagre node position (anchor=center center) to the top left
    // so it matches the React Flow node anchor point (top left).
    node.position = {
      x: nodeWithPosition.x - nodeWidth / 2,
      y: nodeWithPosition.y - nodeHeight / 2,
    };

    return node;
  });

  return { nodes: layoutedNodes, edges };
};

const isHorizontal = false;

export default function RoadmapPage() {
  const [dialogOpen, setDialogOpen] = useState(true);
  const [position, setPosition] = useState("");
  const [roadmapType, setRoadmapType] = useState<"linear" | "branching">("linear");
  const [generated, setGenerated] = useState(false);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { saveRoadmap } = useDatabase();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.roadmap) {
      const { roadmap } = location.state;
      setPosition(roadmap.position);

      // Handle legacy data where everything was saved in 'nodes' column
      if (!Array.isArray(roadmap.nodes) && roadmap.nodes && typeof roadmap.nodes === 'object' && 'nodes' in roadmap.nodes) {
        const legacyData = roadmap.nodes as any;
        setNodes(legacyData.nodes || []);
        setEdges(legacyData.edges || []);
        setRoadmapType(legacyData.type || "linear");
      } else {
        // Handle new correct schema
        setRoadmapType(roadmap.type || "linear");
        setNodes(roadmap.nodes || []);
        setEdges(roadmap.edges || []);
      }
      setGenerated(true);
    }
  }, [location.state]);

  const handleGenerate = async () => {
    if (!position.trim()) return;
    setLoading(true);
    try {
      const result = await generateRoadmap(position, roadmapType);

      let newNodes: Node[] = [];
      let newEdges: Edge[] = [];

      if (roadmapType === "linear") {
        newNodes = result.map((item: any, i: number) => ({
          id: `${i}`,
          type: "default",
          position: { x: 250, y: i * 150 },
          data: { label: `${item.title}\n${item.description}` },
          style: { background: "#fef3c7", border: "1px solid #f59e0b", borderRadius: "8px", padding: "10px", width: 300 },
        }));

        newEdges = result.slice(0, -1).map((_: any, i: number) => ({
          id: `e${i}-${i + 1}`,
          source: `${i}`,
          target: `${i + 1}`,
          animated: true,
        }));
      } else {
        // Branching logic
        if (!result.nodes || !result.edges) throw new Error("Invalid roadmap format received");

        const rawNodes = result.nodes.map((node: any) => ({
          id: node.id,
          type: "default",
          data: { label: `${node.label}\n${node.description || ''}` },
          position: { x: 0, y: 0 }, // Handled by dagre
          style: { background: "#dbeafe", border: "1px solid #2563eb", borderRadius: "8px", padding: "10px", width: 300 },
        }));

        const rawEdges = result.edges.map((edge: any, i: number) => ({
          id: `e${i}`,
          source: edge.source,
          target: edge.target,
          label: edge.label,
          animated: true,
          type: 'smoothstep'
        }));

        const layouted = getLayoutedElements(rawNodes, rawEdges);
        newNodes = layouted.nodes;
        newEdges = layouted.edges;
      }

      setNodes(newNodes);
      setEdges(newEdges);
      setDialogOpen(false);
      setGenerated(true);
      await saveRoadmap(position, { nodes: newNodes, edges: newEdges, type: roadmapType });
    } catch (error: any) {
      console.error(error);
      toast({ title: "Error", description: error.message || "Failed to generate roadmap", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Generate Learning Roadmap</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Role or Skill</Label>
              <Input
                placeholder="e.g Full Stack Developer"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
              />
            </div>

            <div className="space-y-2">
              <Label>Roadmap Style</Label>
              <RadioGroup defaultValue="linear" onValueChange={(v) => setRoadmapType(v as any)} className="grid grid-cols-2 gap-4">
                <div>
                  <RadioGroupItem value="linear" id="linear" className="peer sr-only" />
                  <Label
                    htmlFor="linear"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <List className="mb-3 h-6 w-6" />
                    Linear Path
                  </Label>
                </div>
                <div>
                  <RadioGroupItem value="branching" id="branching" className="peer sr-only" />
                  <Label
                    htmlFor="branching"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <GitBranch className="mb-3 h-6 w-6" />
                    Branching Tree
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleGenerate} disabled={!position.trim() || loading}>
              <Sparkles className="mr-2 h-4 w-4" /> {loading ? "Generating..." : "Generate"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {generated && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">{position} Roadmap</h2>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => {
              const element = document.createElement("a");
              const file = new Blob([JSON.stringify({ position, nodes, edges, type: roadmapType }, null, 2)], { type: "application/json" });
              element.href = URL.createObjectURL(file);
              element.download = `${position.replace(/\s+/g, "_")}_Roadmap.json`;
              document.body.appendChild(element);
              element.click();
              document.body.removeChild(element);
            }}>
              <Download className="mr-2 h-4 w-4" /> Download JSON
            </Button>
            <Button onClick={() => { setGenerated(false); setPosition(""); setDialogOpen(true); }}>
              + Create Another Roadmap
            </Button>
          </div>

          <div className="h-[600px] border rounded-xl bg-card">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              fitView
            >
              <Background />
              <Controls />
              <MiniMap />
            </ReactFlow>
          </div>
        </div>
      )
      }

      {
        !generated && !dialogOpen && (
          <div className="text-center py-20">
            <p className="text-muted-foreground">Click the button below to generate a roadmap</p>
            <Button className="mt-4" onClick={() => setDialogOpen(true)}>
              <Sparkles className="mr-2 h-4 w-4" /> Generate Roadmap
            </Button>
          </div>
        )
      }
    </div >
  );
}
