class TopologyVisualizer {
    constructor() {
        this.canvas = document.getElementById('topologyCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.currentTopology = 'bus';
        this.nodes = [];
        this.connections = [];
        
        this.topologyData = {
            bus: {
                title: 'Bus Topology',
                advantages: [
                    'Easy to install and extend',
                    'Less cable required',
                    'Cost-effective',
                    'Suitable for small networks'
                ],
                disadvantages: [
                    'Limited cable length',
                    'Performance issues with heavy traffic',
                    'If backbone cable fails, network fails',
                    'Signal interference and attenuation'
                ]
            },
            ring: {
                title: 'Ring Topology',
                advantages: [
                    'Equal access to resources',
                    'Simple to install',
                    'Less cable required',
                    'No central node needed'
                ],
                disadvantages: [
                    'Single point of failure affects network',
                    'Adding/removing devices disrupts network',
                    'Troubleshooting is difficult',
                    'Data travels through each node'
                ]
            },
            star: {
                title: 'Star Topology',
                advantages: [
                    'Easy to install and manage',
                    'Centralized management',
                    'Easy to detect faults',
                    'One device failure doesn\'t affect others'
                ],
                disadvantages: [
                    'Requires more cable',
                    'If central hub fails, network fails',
                    'More expensive',
                    'Performance depends on central hub'
                ]
            },
            mesh: {
                title: 'Mesh Topology',
                definition: 'A network topology where each device is connected directly to every other device in the network, providing multiple paths for data.',
                advantages: [
                    'Highly reliable and fault-tolerant',
                    'No single point of failure',
                    'Better security and privacy',
                    'Data can take multiple paths'
                ],
                disadvantages: [
                    'Very expensive to implement',
                    'Complex installation and configuration',
                    'Requires more cables and ports',
                    'Difficult to maintain and troubleshoot'
                ]
            },
            tree: {
                title: 'Tree Topology',
                definition: 'A hierarchical network structure where nodes are arranged like a tree with a root node at the top and branches of child nodes below.',
                advantages: [
                    'Easy to expand the network',
                    'Easy to manage and maintain',
                    'Error detection is simple',
                    'Suitable for large networks'
                ],
                disadvantages: [
                    'Dependent on root node',
                    'Requires more cable',
                    'If root fails, network fails',
                    'More expensive than bus topology'
                ]
            },
            hybrid: {
                title: 'Hybrid Topology',
                definition: 'A combination of two or more different network topologies to form a network that meets specific requirements and overcome limitations of individual topologies.',
                advantages: [
                    'Highly flexible',
                    'Can be optimized for specific needs',
                    'Reliable and efficient',
                    'Best features of multiple topologies'
                ],
                disadvantages: [
                    'Complex design and implementation',
                    'Expensive to set up',
                    'Requires skilled maintenance',
                    'Can be difficult to troubleshoot'
                ]
            }
        };

        this.initializeEventListeners();
        this.resizeCanvas();
        this.switchTopology('bus');
    }

    initializeEventListeners() {
        window.addEventListener('resize', () => this.resizeCanvas());
        
        document.querySelectorAll('.topology-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.topology-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.switchTopology(e.target.dataset.topology);
            });
        });
    }

    resizeCanvas() {
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
        this.draw();
    }

    switchTopology(topology) {
        this.currentTopology = topology;
        this.updateInfo();
        this.resetAnimation();
        this.draw();
    }

    updateInfo() {
        const data = this.topologyData[this.currentTopology];
        document.getElementById('topologyTitle').textContent = data.title;
        document.getElementById('topologyDefinition').textContent = data.definition;
        
        const advantagesList = document.getElementById('advantagesList');
        const disadvantagesList = document.getElementById('disadvantagesList');
        
        advantagesList.innerHTML = data.advantages.map(adv => `<li>${adv}</li>`).join('');
        disadvantagesList.innerHTML = data.disadvantages.map(dis => `<li>${dis}</li>`).join('');
    }

    resetAnimation() {
        this.nodes = [];
        this.connections = [];
        
        switch(this.currentTopology) {
            case 'bus':
                this.setupBusTopology();
                break;
            case 'ring':
                this.setupRingTopology();
                break;
            case 'star':
                this.setupStarTopology();
                break;
            case 'mesh':
                this.setupMeshTopology();
                break;
            case 'tree':
                this.setupTreeTopology();
                break;
            case 'hybrid':
                this.setupHybridTopology();
                break;
        }
    }

    setupBusTopology() {
        const centerY = this.canvas.height / 2;
        const spacing = this.canvas.width / 6;
        
        // Create nodes
        for(let i = 0; i < 5; i++) {
            this.nodes.push({
                x: spacing + (i * spacing),
                y: centerY - 50,
                radius: 20
            });
        }
        
        // Create backbone
        this.connections.push({
            x1: spacing / 2,
            y1: centerY,
            x2: this.canvas.width - spacing / 2,
            y2: centerY
        });
    }

    setupRingTopology() {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const radius = Math.min(this.canvas.width, this.canvas.height) / 3;
        
        for(let i = 0; i < 6; i++) {
            const angle = (i / 6) * Math.PI * 2;
            this.nodes.push({
                x: centerX + Math.cos(angle) * radius,
                y: centerY + Math.sin(angle) * radius,
                radius: 20
            });
        }
    }

    setupStarTopology() {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const radius = Math.min(this.canvas.width, this.canvas.height) / 3;
        
        // Central node
        this.nodes.push({
            x: centerX,
            y: centerY,
            radius: 25
        });
        
        // Peripheral nodes
        for(let i = 0; i < 6; i++) {
            const angle = (i / 6) * Math.PI * 2;
            this.nodes.push({
                x: centerX + Math.cos(angle) * radius,
                y: centerY + Math.sin(angle) * radius,
                radius: 20
            });
        }
    }

    setupMeshTopology() {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const radius = Math.min(this.canvas.width, this.canvas.height) / 4;
        
        // Create nodes in a pentagon shape
        for(let i = 0; i < 5; i++) {
            const angle = (i / 5) * Math.PI * 2 - Math.PI / 2;
            this.nodes.push({
                x: centerX + Math.cos(angle) * radius,
                y: centerY + Math.sin(angle) * radius,
                radius: 20
            });
        }
    }

    setupTreeTopology() {
        const startX = this.canvas.width / 2;
        const startY = 50;
        const levelHeight = 100;
        const nodeRadius = 20;

        // Root node
        this.nodes.push({ x: startX, y: startY, radius: nodeRadius });

        // Second level
        const level2Width = this.canvas.width / 3;
        [-1, 1].forEach(offset => {
            this.nodes.push({
                x: startX + offset * level2Width/2,
                y: startY + levelHeight,
                radius: nodeRadius
            });
        });

        // Third level
        const level3Width = this.canvas.width / 4;
        [-3, -1, 1, 3].forEach(offset => {
            this.nodes.push({
                x: startX + offset * level3Width/2,
                y: startY + levelHeight * 2,
                radius: nodeRadius
            });
        });
    }

    setupHybridTopology() {
        // Combining star and bus topology
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        
        // Central hub
        this.nodes.push({ x: centerX, y: centerY, radius: 25 });
        
        // Star connections
        const radius = Math.min(this.canvas.width, this.canvas.height) / 4;
        for(let i = 0; i < 3; i++) {
            const angle = (i / 3) * Math.PI * 2 - Math.PI / 2;
            this.nodes.push({
                x: centerX + Math.cos(angle) * radius,
                y: centerY + Math.sin(angle) * radius,
                radius: 20
            });
        }
        
        // Bus line at bottom
        const busY = centerY + radius + 50;
        this.connections.push({
            x1: centerX - radius,
            y1: busY,
            x2: centerX + radius,
            y2: busY
        });
        
        // Bus nodes
        [-1, 0, 1].forEach(offset => {
            this.nodes.push({
                x: centerX + offset * (radius/2),
                y: busY - 40,
                radius: 20
            });
        });
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw connections
        this.ctx.strokeStyle = '#3498db';
        this.ctx.lineWidth = 3;
        
        if(this.currentTopology === 'bus') {
            this.drawBusConnections();
        } else {
            this.drawConnections();
        }
        
        // Draw nodes
        this.nodes.forEach((node, index) => {
            this.ctx.beginPath();
            this.ctx.fillStyle = index === 0 && this.currentTopology === 'star' ? '#e74c3c' : '#3498db';
            this.ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }

    drawBusConnections() {
        // Draw backbone
        this.ctx.beginPath();
        this.connections.forEach(conn => {
            this.ctx.moveTo(conn.x1, conn.y1);
            this.ctx.lineTo(conn.x2, conn.y2);
        });
        this.ctx.stroke();
        
        // Draw vertical connections
        this.nodes.forEach(node => {
            this.ctx.beginPath();
            this.ctx.moveTo(node.x, node.y + node.radius);
            this.ctx.lineTo(node.x, this.canvas.height / 2);
            this.ctx.stroke();
        });
    }

    drawConnections() {
        if(this.currentTopology === 'ring') {
            this.ctx.beginPath();
            this.nodes.forEach((node, index) => {
                const nextNode = this.nodes[(index + 1) % this.nodes.length];
                this.ctx.moveTo(node.x, node.y);
                this.ctx.lineTo(nextNode.x, nextNode.y);
            });
            this.ctx.stroke();
        } else if(this.currentTopology === 'star') {
            const centerNode = this.nodes[0];
            this.ctx.beginPath();
            for(let i = 1; i < this.nodes.length; i++) {
                this.ctx.moveTo(centerNode.x, centerNode.y);
                this.ctx.lineTo(this.nodes[i].x, this.nodes[i].y);
            }
            this.ctx.stroke();
        } else if(this.currentTopology === 'mesh') {
            // Connect every node to every other node
            this.ctx.beginPath();
            for(let i = 0; i < this.nodes.length; i++) {
                for(let j = i + 1; j < this.nodes.length; j++) {
                    this.ctx.moveTo(this.nodes[i].x, this.nodes[i].y);
                    this.ctx.lineTo(this.nodes[j].x, this.nodes[j].y);
                }
            }
            this.ctx.stroke();
        } else if(this.currentTopology === 'tree') {
            this.ctx.beginPath();
            // Connect root to level 2
            for(let i = 1; i <= 2; i++) {
                this.ctx.moveTo(this.nodes[0].x, this.nodes[0].y);
                this.ctx.lineTo(this.nodes[i].x, this.nodes[i].y);
            }
            // Connect level 2 to level 3
            this.ctx.moveTo(this.nodes[1].x, this.nodes[1].y);
            this.ctx.lineTo(this.nodes[3].x, this.nodes[3].y);
            this.ctx.lineTo(this.nodes[4].x, this.nodes[4].y);
            this.ctx.moveTo(this.nodes[2].x, this.nodes[2].y);
            this.ctx.lineTo(this.nodes[5].x, this.nodes[5].y);
            this.ctx.lineTo(this.nodes[6].x, this.nodes[6].y);
            this.ctx.stroke();
        } else if(this.currentTopology === 'hybrid') {
            // Draw star connections
            const centerNode = this.nodes[0];
            this.ctx.beginPath();
            for(let i = 1; i <= 3; i++) {
                this.ctx.moveTo(centerNode.x, centerNode.y);
                this.ctx.lineTo(this.nodes[i].x, this.nodes[i].y);
            }
            
            // Draw bus connections
            this.drawBusConnections();
            
            // Draw vertical connections to bus
            for(let i = 4; i < this.nodes.length; i++) {
                this.ctx.beginPath();
                this.ctx.moveTo(this.nodes[i].x, this.nodes[i].y + this.nodes[i].radius);
                this.ctx.lineTo(this.nodes[i].x, this.connections[0].y1);
                this.ctx.stroke();
            }
        }
    }
}

// Initialize the visualizer when the page loads
window.addEventListener('load', () => {
    new TopologyVisualizer();
}); 