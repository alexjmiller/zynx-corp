export default function HeroBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Gradient fade on left edge */}
      <div
        className="absolute inset-0 z-10"
        style={{
          background: 'linear-gradient(to left, transparent 30%, var(--color-background) 60%)'
        }}
      />

      <svg
        className="absolute w-full h-full"
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMaxYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Code pattern layer - 25 degree angle, light grey */}
        <g transform="rotate(25, 900, 400)" opacity="0.15">
          <text fill="#838383" fontFamily="monospace" fontSize="13">
            <tspan x="500" y="0">import {'{'} design, develop, iterate {'}'} from 'zynx';</tspan>
            <tspan x="500" y="22">import {'{'} UserCentered {'}'} from 'approach';</tspan>
            <tspan x="500" y="44">import {'{'} validate, test {'}'} from 'methods';</tspan>
            <tspan x="500" y="88">const buildSolution = async (needs) =&gt; {'{'}</tspan>
            <tspan x="500" y="110">  const research = await understand(needs);</tspan>
            <tspan x="500" y="132">  const insights = analyze(research);</tspan>
            <tspan x="500" y="154">  const prototype = design(insights);</tspan>
            <tspan x="500" y="176">  const tested = await validate(prototype);</tspan>
            <tspan x="500" y="198">  return iterate(tested);</tspan>
            <tspan x="500" y="220">{'}'}</tspan>
            <tspan x="500" y="264">function createValue(business) {'{'}</tspan>
            <tspan x="500" y="286">  const goals = business.goals;</tspan>
            <tspan x="500" y="308">  const solutions = goals.map(solve);</tspan>
            <tspan x="500" y="330">  return solutions.filter(validate);</tspan>
            <tspan x="500" y="352">{'}'}</tspan>
            <tspan x="500" y="396">class Project extends UserCentered {'{'}</tspan>
            <tspan x="500" y="418">  constructor(scope) {'{'}</tspan>
            <tspan x="500" y="440">    super(scope);</tspan>
            <tspan x="500" y="462">    this.iterate = true;</tspan>
            <tspan x="500" y="484">    this.userFirst = true;</tspan>
            <tspan x="500" y="506">  {'}'}</tspan>
            <tspan x="500" y="550">  async deliver() {'{'}</tspan>
            <tspan x="500" y="572">    await this.test();</tspan>
            <tspan x="500" y="594">    return this.launch();</tspan>
            <tspan x="500" y="616">  {'}'}</tspan>
            <tspan x="500" y="638">{'}'}</tspan>
            <tspan x="500" y="682">// Transform ideas into reality</tspan>
            <tspan x="500" y="704">const transform = (idea) =&gt; {'{'}</tspan>
            <tspan x="500" y="726">  const validated = test(idea);</tspan>
            <tspan x="500" y="748">  return build(validated);</tspan>
            <tspan x="500" y="770">{'}'}</tspan>

            <tspan x="920" y="50">export default async function main() {'{'}</tspan>
            <tspan x="920" y="72">  const client = await connect();</tspan>
            <tspan x="920" y="94">  const needs = await discover(client);</tspan>
            <tspan x="920" y="116">  const solution = buildSolution(needs);</tspan>
            <tspan x="920" y="138">  return deliver(solution);</tspan>
            <tspan x="920" y="160">{'}'}</tspan>
            <tspan x="920" y="204">const workflow = [</tspan>
            <tspan x="920" y="226">  'research',</tspan>
            <tspan x="920" y="248">  'prototype',</tspan>
            <tspan x="920" y="270">  'test',</tspan>
            <tspan x="920" y="292">  'learn',</tspan>
            <tspan x="920" y="314">  'iterate',</tspan>
            <tspan x="920" y="336">  'deliver'</tspan>
            <tspan x="920" y="358">];</tspan>
            <tspan x="920" y="402">const config = {'{'}</tspan>
            <tspan x="920" y="424">  approach: 'user-centered',</tspan>
            <tspan x="920" y="446">  method: 'agile',</tspan>
            <tspan x="920" y="468">  focus: 'outcomes',</tspan>
            <tspan x="920" y="490">  quality: 'always'</tspan>
            <tspan x="920" y="512">{'}'};</tspan>
            <tspan x="920" y="556">async function prototype(concept) {'{'}</tspan>
            <tspan x="920" y="578">  const wireframe = sketch(concept);</tspan>
            <tspan x="920" y="600">  const feedback = await test(wireframe);</tspan>
            <tspan x="920" y="622">  return refine(wireframe, feedback);</tspan>
            <tspan x="920" y="644">{'}'}</tspan>
          </text>
        </g>

        {/* Wireframe layer - 23 degree angle, purple lines, scaled down 70% */}
        <g transform="rotate(23, 900, 400) scale(0.7)" stroke="#6417a3" strokeWidth="1" fill="none" opacity="0.4">
          {/* Main app frame */}
          <g transform="translate(950, 50)">
            <rect x="0" y="0" width="280" height="500" rx="8" />
            <line x1="0" y1="35" x2="280" y2="35" />
            <rect x="20" y="50" width="120" height="12" rx="2" />
            <circle cx="250" cy="56" r="8" />
            <rect x="20" y="85" width="240" height="32" rx="4" />
            <rect x="20" y="140" width="240" height="80" rx="4" />
            <line x1="40" y1="160" x2="160" y2="160" />
            <line x1="40" y1="180" x2="220" y2="180" />
            <line x1="40" y1="200" x2="100" y2="200" />
            <rect x="20" y="235" width="240" height="80" rx="4" />
            <line x1="40" y1="255" x2="160" y2="255" />
            <line x1="40" y1="275" x2="220" y2="275" />
            <line x1="40" y1="295" x2="100" y2="295" />
            <rect x="20" y="330" width="240" height="80" rx="4" />
            <line x1="40" y1="350" x2="160" y2="350" />
            <line x1="40" y1="370" x2="220" y2="370" />
            <line x1="40" y1="390" x2="100" y2="390" />
            <line x1="0" y1="440" x2="280" y2="440" />
            <circle cx="60" cy="470" r="12" />
            <circle cx="140" cy="470" r="12" />
            <circle cx="220" cy="470" r="12" />
          </g>

          </g>

        {/* Second wireframe - independent positioning, near bottom */}
        <g transform="translate(750, 380) rotate(23) scale(0.7)" stroke="#6417a3" strokeWidth="1" fill="none" opacity="0.4">
          <rect x="0" y="0" width="220" height="380" rx="6" />
          <line x1="0" y1="30" x2="220" y2="30" />
          <rect x="15" y="45" width="100" height="10" rx="2" />
          <rect x="15" y="70" width="190" height="100" rx="4" />
          <line x1="30" y1="100" x2="150" y2="100" />
          <line x1="30" y1="120" x2="180" y2="120" />
          <line x1="30" y1="140" x2="100" y2="140" />
          <rect x="15" y="185" width="190" height="50" rx="4" />
          <line x1="30" y1="205" x2="120" y2="205" />
          <line x1="30" y1="220" x2="160" y2="220" />
          <rect x="15" y="250" width="190" height="50" rx="4" />
          <line x1="30" y1="270" x2="120" y2="270" />
          <line x1="30" y1="285" x2="160" y2="285" />
          <rect x="15" y="315" width="90" height="32" rx="4" />
          <rect x="115" y="315" width="90" height="32" rx="4" />
        </g>
      </svg>
    </div>
  )
}
