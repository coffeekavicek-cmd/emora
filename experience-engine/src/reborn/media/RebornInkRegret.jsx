import { InkRegretExperience } from '../../apology/InkRegretExperience.jsx';
import { FlagshipMediaShell } from './FlagshipMediaShell.jsx';
export function RebornInkRegret(props){return <FlagshipMediaShell kind="ink" content={props.content} media={props.media}><InkRegretExperience {...props}/></FlagshipMediaShell>}
