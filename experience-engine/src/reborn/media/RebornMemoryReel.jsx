import { MemoryReelExperience } from '../../birthday/MemoryReelExperience.jsx';
import { FlagshipMediaShell } from './FlagshipMediaShell.jsx';
export function RebornMemoryReel(props){return <FlagshipMediaShell kind="memory" content={props.content} media={props.media}><MemoryReelExperience {...props}/></FlagshipMediaShell>}
