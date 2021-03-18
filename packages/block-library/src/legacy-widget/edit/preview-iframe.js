/**
 * WordPress dependencies
 */
import { addQueryArgs } from '@wordpress/url';
import { useRef, useState, useCallback, useEffect } from '@wordpress/element';
import { Disabled } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

const DEFAULT_HEIGHT = 300;

export default function PreviewIframe( { idBase, instance, isVisible } ) {
	const ref = useRef();

	const [ height, setHeight ] = useState( DEFAULT_HEIGHT );

	const adjustHeight = useCallback( () => {
		setHeight( ref.current.contentDocument.body.scrollHeight );
	} );

	useEffect( () => {
		if ( isVisible ) {
			adjustHeight();
		}
	}, [ isVisible ] );

	return (
		<Disabled hidden={ ! isVisible }>
			<iframe
				ref={ ref }
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
