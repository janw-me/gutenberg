/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { __experimentalLibrary as Library } from '@wordpress/block-editor';
import { Button } from '@wordpress/components';
import { useInstanceId } from '@wordpress/compose';
import { closeSmall } from '@wordpress/icons';

function Inserter( { inserter } ) {
	const inserterTitleId = useInstanceId(
		Inserter,
		'customize-widget-layout__inserter-panel-title'
	);

	return (
		<div
			className="customize-widgets-layout__inserter-panel"
			aria-labelledby={ inserterTitleId }
		>
			<div className="customize-widgets-layout__inserter-panel-header">
				<h2
					id={ inserterTitleId }
					className="customize-widgets-layout__inserter-panel-header-title"
				>
					{ __( 'Add a block' ) }
				</h2>
				<Button
					className="customize-widgets-layout__inserter-panel-header-close-button"
					icon={ closeSmall }
					onClick={ () => inserter.collapse() }
					aria-label={ __( 'Close inserter' ) }
				/>
			</div>
			<div className="customize-widgets-layout__inserter-panel-content">
				<Library
					showInserterHelpPanel
					onSelect={ () => inserter.collapse() }
				/>
			</div>
		</div>
	);
}

export default Inserter;
