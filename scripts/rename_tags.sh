#!/bin/bash

# Retrieve the existing tag list and iterate through it
for tag in $(git tag); do
    # Change the '-v' part of the tag to '@'.
    # ilib-loctool-webos-ts-resource-v1.5.4 --> ilib-loctool-webos-ts-resource@1.5.4
    new_tag="${tag/-v/@}"
    
    # Proceed only if the new tag is different from the existing tag
    if [ "$tag" != "$new_tag" ]; then
        # Create a new tag
        git tag "$new_tag" "$tag"
        
        # Push the new tag to the remote
        git push origin "$new_tag"
        
        # Delete the existing tag from the remote
        git push origin --delete "$tag"
        
        # Delete the existing tag from the local
        git tag -d "$tag"
    fi
done
