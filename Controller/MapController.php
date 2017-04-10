<?php

namespace MapBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use MapBundle\Entity\Location;

class MapController extends Controller
{
    public function indexAction()
    {
        return $this->render('MapBundle:Map:index.html.twig');
    }

    public function addAction(Request $request)
    {
        $lat = $request->get('lat');
        $lng = $request->get('lng');
        $name = $request->get('name');
        $em = $this->getDoctrine()->getManager();
        //populate new location and inserting to db
        $marker = new Location();
        $marker->setName($name);
        $marker->setLat($lat);
        $marker->setLng($lng);

        $em->persist($marker);
        $em->flush();
        $response = new JsonResponse();

        return $response->setData(['status' => true, 'message' => 'worked']);
    }

    public function getAction()
    {
        $em = $this->getDoctrine()->getManager();
        $allLocations = $em->getRepository('MapBundle:Location')->getAll();
        $return = [];
        foreach ($allLocations as $location) {
            $return[] = [
                'lat'  => $location->getLat(),
                'lng'  => $location->getLng(),
                'name' => $location->getName()
            ];
        }
        $response = new JsonResponse();

        return $response->setData(['status' => true, 'data' => $return]);
    }
}
