import { useEffect, useRef, useState } from "react";
import { CreeWord } from "../data/mockData";
import { useNavigate } from "react-router";

interface Node {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  word: CreeWord;
}

interface Link {
  source: string;
  target: string;
  type: 'related' | 'synonym' | 'antonym' | 'broader' | 'narrower';
}

interface SemanticNetworkViewProps {
  words: CreeWord[];
  expertMode: boolean;
}

export function SemanticNetworkView({ words, expertMode }: SemanticNetworkViewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [links, setLinks] = useState<Link[]>([]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const animationRef = useRef<number>();
  const navigate = useNavigate();

  useEffect(() => {
    // Initialize nodes with random positions
    const centerX = 400;
    const centerY = 300;
    const radius = 150;
    
    const newNodes: Node[] = words.map((word, i) => {
      const angle = (i / words.length) * 2 * Math.PI;
      return {
        id: word.id,
        x: centerX + Math.cos(angle) * radius + (Math.random() - 0.5) * 50,
        y: centerY + Math.sin(angle) * radius + (Math.random() - 0.5) * 50,
        vx: 0,
        vy: 0,
        word
      };
    });

    // Create links based on relationships
    const newLinks: Link[] = [];
    words.forEach(word => {
      if (word.relationships.related) {
        word.relationships.related.forEach(relatedId => {
          if (words.find(w => w.id === relatedId)) {
            newLinks.push({ source: word.id, target: relatedId, type: 'related' });
          }
        });
      }
      if (word.relationships.synonyms) {
        word.relationships.synonyms.forEach(synonymId => {
          if (words.find(w => w.id === synonymId)) {
            newLinks.push({ source: word.id, target: synonymId, type: 'synonym' });
          }
        });
      }
      if (word.relationships.antonyms) {
        word.relationships.antonyms.forEach(antonymId => {
          if (words.find(w => w.id === antonymId)) {
            newLinks.push({ source: word.id, target: antonymId, type: 'antonym' });
          }
        });
      }
      if (word.relationships.broader) {
        word.relationships.broader.forEach(broaderId => {
          if (words.find(w => w.id === broaderId)) {
            newLinks.push({ source: word.id, target: broaderId, type: 'broader' });
          }
        });
      }
      if (word.relationships.narrower) {
        word.relationships.narrower.forEach(narrowerId => {
          if (words.find(w => w.id === narrowerId)) {
            newLinks.push({ source: word.id, target: narrowerId, type: 'narrower' });
          }
        });
      }
    });

    setNodes(newNodes);
    setLinks(newLinks);
  }, [words]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Force-directed layout simulation
    const simulate = () => {
      const width = canvas.width;
      const height = canvas.height;

      // Apply forces
      setNodes(currentNodes => {
        const updatedNodes = [...currentNodes];

        // Repulsion between nodes
        for (let i = 0; i < updatedNodes.length; i++) {
          for (let j = i + 1; j < updatedNodes.length; j++) {
            const dx = updatedNodes[j].x - updatedNodes[i].x;
            const dy = updatedNodes[j].y - updatedNodes[i].y;
            const distance = Math.sqrt(dx * dx + dy * dy) || 1;
            const force = 500 / (distance * distance);
            
            updatedNodes[i].vx -= (dx / distance) * force;
            updatedNodes[i].vy -= (dy / distance) * force;
            updatedNodes[j].vx += (dx / distance) * force;
            updatedNodes[j].vy += (dy / distance) * force;
          }
        }

        // Attraction along links
        links.forEach(link => {
          const source = updatedNodes.find(n => n.id === link.source);
          const target = updatedNodes.find(n => n.id === link.target);
          
          if (source && target) {
            const dx = target.x - source.x;
            const dy = target.y - source.y;
            const distance = Math.sqrt(dx * dx + dy * dy) || 1;
            const force = distance * 0.01;
            
            source.vx += (dx / distance) * force;
            source.vy += (dy / distance) * force;
            target.vx -= (dx / distance) * force;
            target.vy -= (dy / distance) * force;
          }
        });

        // Center attraction
        updatedNodes.forEach(node => {
          const dx = width / 2 - node.x;
          const dy = height / 2 - node.y;
          node.vx += dx * 0.001;
          node.vy += dy * 0.001;
        });

        // Update positions with damping
        updatedNodes.forEach(node => {
          node.vx *= 0.9;
          node.vy *= 0.9;
          node.x += node.vx;
          node.y += node.vy;

          // Keep within bounds
          node.x = Math.max(30, Math.min(width - 30, node.x));
          node.y = Math.max(30, Math.min(height - 30, node.y));
        });

        return updatedNodes;
      });

      // Render
      ctx.clearRect(0, 0, width, height);

      // Draw links
      links.forEach(link => {
        const source = nodes.find(n => n.id === link.source);
        const target = nodes.find(n => n.id === link.target);
        
        if (source && target) {
          ctx.beginPath();
          ctx.moveTo(source.x, source.y);
          ctx.lineTo(target.x, target.y);
          
          if (link.type === 'synonym') {
            ctx.strokeStyle = '#10b981';
            ctx.lineWidth = 2;
          } else if (link.type === 'antonym') {
            ctx.strokeStyle = '#ef4444';
            ctx.lineWidth = 2;
          } else if (link.type === 'broader') {
            ctx.strokeStyle = '#8b5cf6';
            ctx.lineWidth = 1.5;
          } else if (link.type === 'narrower') {
            ctx.strokeStyle = '#3b82f6';
            ctx.lineWidth = 1.5;
          } else {
            ctx.strokeStyle = '#cbd5e1';
            ctx.lineWidth = 1;
          }
          
          ctx.stroke();
        }
      });

      // Draw nodes
      nodes.forEach(node => {
        const isSelected = selectedNode === node.id;
        
        ctx.beginPath();
        ctx.arc(node.x, node.y, isSelected ? 20 : 15, 0, 2 * Math.PI);
        ctx.fillStyle = isSelected ? '#6366f1' : '#ffffff';
        ctx.fill();
        ctx.strokeStyle = '#6366f1';
        ctx.lineWidth = isSelected ? 3 : 2;
        ctx.stroke();

        // Draw label
        ctx.fillStyle = '#1f2937';
        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        const text = expertMode 
          ? `${node.word.cree} (${node.word.partOfSpeech})`
          : node.word.cree;
        
        const textWidth = ctx.measureText(text).width;
        const padding = 4;
        
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.fillRect(
          node.x - textWidth / 2 - padding,
          node.y - 25 - 8,
          textWidth + padding * 2,
          16
        );
        
        ctx.fillStyle = '#1f2937';
        ctx.fillText(text, node.x, node.y - 25);
      });

      animationRef.current = requestAnimationFrame(simulate);
    };

    simulate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [nodes, links, selectedNode, expertMode]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check if clicked on a node
    const clickedNode = nodes.find(node => {
      const dx = x - node.x;
      const dy = y - node.y;
      return Math.sqrt(dx * dx + dy * dy) < 15;
    });

    if (clickedNode) {
      navigate(`/word/${clickedNode.id}`);
    }
  };

  const handleCanvasHover = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check if hovering over a node
    const hoveredNode = nodes.find(node => {
      const dx = x - node.x;
      const dy = y - node.y;
      return Math.sqrt(dx * dx + dy * dy) < 15;
    });

    setSelectedNode(hoveredNode?.id || null);
    canvas.style.cursor = hoveredNode ? 'pointer' : 'default';
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-semibold mb-2">Semantic Network Visualization</h3>
        <div className="flex gap-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-0.5 bg-slate-300"></div>
            <span className="text-gray-600">Related</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-0.5 bg-green-500"></div>
            <span className="text-gray-600">Synonym</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-0.5 bg-red-500"></div>
            <span className="text-gray-600">Antonym</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-0.5 bg-purple-500"></div>
            <span className="text-gray-600">Broader</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-0.5 bg-blue-500"></div>
            <span className="text-gray-600">Narrower</span>
          </div>
        </div>
      </div>
      
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        className="w-full"
        onClick={handleCanvasClick}
        onMouseMove={handleCanvasHover}
        style={{ touchAction: 'none' }}
      />
      
      <div className="p-3 bg-gray-50 text-xs text-gray-600 text-center">
        Click on any node to view word details
      </div>
    </div>
  );
}
