/* eslint-disable jsx-a11y/iframe-has-title */
import { ImagePreviewModalButton } from '@components';
import { FaGlobe, FaGithub } from 'react-icons/fa6';
import { LuServer } from 'react-icons/lu';
import { imageModalSelector, useShallow } from '@selectors';
import { appStore } from '@store';
import { Key } from 'react';
import {
  Box,
  Flex,
  Grid,
  Heading,
  HStack,
  Image,
  Text,
  Button,
  Badge,
  Link,
} from '@chakra-ui/react';

export type IProjectPreviewComponentProps = {
  project: any;
};

const ProjectPreviewComponent = (props: IProjectPreviewComponentProps) => {
  const { setImageString } = appStore(useShallow(imageModalSelector));
  const onImageClickHandler = (image: string) => {
    setImageString(image);
  };

  return (
    <Box
      bg="bg.card"
      shadow="xl"
      border="1px solid"
      borderColor="border.subtle"
      borderRadius="md"
      w="100%"
      px={4}
      py={3}
      h="full"
    >
      <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={6} w="100%">
        <Flex direction="column" gap={4}>
          <Flex
            direction="row"
            align="center"
            justify="space-between"
            wrap="wrap"
            gap={3}
          >
            <Flex direction="row" align="center" gap={4}>
              <Image
                src={props.project.projectIcon}
                alt={props.project.title}
                loading="lazy"
                boxSize="80px"
                borderRadius="md"
                border="1px solid"
                borderColor="gray.600"
                p={1}
                _hover={{ transform: 'scale(1.1)' }}
                transition="transform 0.3s ease-in-out"
              />
              <Heading size="2xl" fontWeight="bold" color="white">
                {props.project.projectName}
              </Heading>
            </Flex>
            <Box>
              {props.project.isLive ? (
                <Badge colorPalette="green" variant="solid" size="lg">
                  Live
                </Badge>
              ) : (
                <Badge colorPalette="red" variant="solid" size="lg">
                  Not live
                </Badge>
              )}
            </Box>
          </Flex>

          {/* Link buttons */}
          <Flex direction="row" wrap="wrap" gap={3} py={2}>
            <Link
              href={'http://' + props.project.projectLink}
              target="_blank"
              rel="noreferrer"
              style={{ flex: 1, textDecoration: 'none' }}
            >
              <Button
                variant="outline"
                colorPalette="green"
                w="100%"
                justifyContent="space-between"
                px={4}
              >
                <FaGlobe />
                Project live link
              </Button>
            </Link>
            <Link
              href={props.project.githubLink}
              target="_blank"
              rel="noreferrer"
              style={{ flex: 1, textDecoration: 'none' }}
            >
              <Button
                variant="outline"
                colorPalette="gray"
                w="100%"
                justifyContent="space-between"
                px={4}
              >
                <FaGithub />
                Github repo link
              </Button>
            </Link>
            <Link
              href={props.project.hostingerLink}
              target="_blank"
              rel="noreferrer"
              style={{ flex: 1, textDecoration: 'none' }}
            >
              <Button
                variant="outline"
                colorPalette="blue"
                w="100%"
                justifyContent="space-between"
                px={4}
              >
                <LuServer />
                Hostinger link
              </Button>
            </Link>
          </Flex>

          {/* Project description */}
          <Box display="flex" flexDirection="column" gap={2}>
            <Heading size="md" color="white" fontWeight="semibold">
              Project description
            </Heading>
            <Text color="gray.300" fontSize="sm">
              {props.project.projectDesc}
            </Text>
          </Box>

          <HStack gap={3} p={2} overflowX="auto" w="100%">
            {props.project.images.map(
              (image: string | undefined, index: Key | null | undefined) => (
                <ImagePreviewModalButton
                  onClickHandler={() => {
                    onImageClickHandler(image as string);
                  }}
                  key={index}
                >
                  <Image
                    key={index}
                    src={image}
                    alt={props.project.title}
                    loading="lazy"
                    w="150px"
                    h="100px"
                    borderRadius="md"
                    border="1px solid"
                    borderColor="gray.600"
                    p={1}
                    _hover={{ transform: 'scale(1.05)', cursor: 'pointer' }}
                    transition="transform 0.2s"
                  />
                </ImagePreviewModalButton>
              ),
            )}
          </HStack>
        </Flex>

        {/** Mockup part */}
        <Flex direction="column" justify="center" align="center" w="100%">
          <Box
            border="1px solid"
            borderColor="gray.700"
            borderRadius="lg"
            overflow="hidden"
            w="100%"
            bg="gray.900"
            shadow="lg"
          >
            {/* Browser Toolbar */}
            <HStack
              bg="gray.800"
              px={4}
              py={2}
              gap={3}
              borderBottom="1px solid"
              borderColor="gray.700"
            >
              {/* Dots */}
              <HStack gap={1.5}>
                <Box w={3} h={3} borderRadius="full" bg="red.500" />
                <Box w={3} h={3} borderRadius="full" bg="yellow.500" />
                <Box w={3} h={3} borderRadius="full" bg="green.500" />
              </HStack>
              {/* Address Bar */}
              <Box
                flex={1}
                bg="gray.950"
                px={3}
                py={1}
                borderRadius="md"
                border="1px solid"
                borderColor="gray.700"
                color="gray.400"
                fontSize="xs"
                textAlign="center"
              >
                {props.project.projectLink}
              </Box>
            </HStack>
            {/* Browser Body */}
            <Box bg="gray.950" display="flex" justifyContent="center">
              <iframe
                width="100%"
                height={400}
                style={{ border: 0 }}
                loading="lazy"
                src={'http://' + props.project.projectLink}
              />
            </Box>
          </Box>
        </Flex>
      </Grid>
    </Box>
  );
};

export default ProjectPreviewComponent;
