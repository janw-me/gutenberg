/**
 * WordPress dependencies
 */
import { addQueryArgs } from '@wordpress/url';
import { useRef, useState, useCallback, useEffect } from '@wordpress/element';
import { Disabled } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

const DEFAULT_HEIGHT = 300;

export default function LegacyWidgetEditPreview( {
	idBase,
	instance,
	isVisible,
} ) {
	const iframeRef = useRef();

	const [ height, setHeight ] = useState( DEFAULT_HEIGHT );

	const adjustHeight = useCallback( () => {
		setHeight( iframeRef.current.contentDocument.body.scrollHeight );
	} );

	useEffect( () => {
		if ( isVisible ) {
			adjustHeight();
		}
	}, [ isVisible ] );

	return (
		<Disabled hidden={ ! isVisible }>
			<iframe
				ref={ iframeRef }
				// TODO: This code should live with the block in index.php.
				src={ addQueryArgs( 'themes.php', {
					page: 'gutenberg-widgets',
					'widget-preview': {
						idBase,
						instance,
					},
				} ) }
				title={ __( 'Legacy Widget Preview' ) }
				height={ height }
				onLoad={ adjustHeight }
			/>
		</Disabled>
	);
}
